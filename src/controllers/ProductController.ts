// import { Request, Response, NextFunction } from 'express';
// import { ApiResponse } from '../utils/ApiResponse';
// import { ApiError } from '../utils/ApiError';
// import { CreateProductDTO, UpdateProductDTO, PricingDTO } from '../dto/ProductDTO';
//
// export class ProductController {
//
//     /**
//      * @desc    Get all products
//      * @route   GET /api/products
//      * @access  Public
//      */
//     async getAllProducts(req: Request, res: Response, next: NextFunction) {
//         try {
//             const productDAO = req.db?.getProductDAO();
//             if (!productDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const products = await productDAO.findAll();
//
//             res.status(200).json(
//                 ApiResponse.success(products, 'Products retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Get product by ID
//      * @route   GET /api/products/:id
//      * @access  Public
//      */
//     async getProductById(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//
//             const productDAO = req.db?.getProductDAO();
//             if (!productDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const product = await productDAO.findById(id);
//
//             if (!product) {
//                 throw ApiError.notFound('Product not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success(product, 'Product retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Create new product
//      * @route   POST /api/products
//      * @access  Private (Admin/Artist)
//      */
//     async createProduct(req: Request, res: Response, next: NextFunction) {
//         try {
//             const productData: CreateProductDTO = req.body;
//
//             const productDAO = req.db?.getProductDAO();
//             if (!productDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Validate pricing data
//             this.validatePricingData(productData.pricing);
//
//             const newProduct = await productDAO.create({
//                 ...productData,
//                 release_date: new Date(productData.release_date),
//             });
//
//             res.status(201).json(
//                 ApiResponse.created(newProduct, 'Product created successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Update product
//      * @route   PUT /api/products/:id
//      * @access  Private (Admin/Artist)
//      */
//     async updateProduct(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//             const productData: UpdateProductDTO = req.body;
//
//             // Convert release_date string to Date if provided
//             if (productData.release_date) {
//                 productData.release_date = new Date(productData.release_date);
//             }
//
//             const productDAO = req.db?.getProductDAO();
//             if (!productDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Validate pricing data if provided
//             if (productData.pricing) {
//                 this.validatePricingData(productData.pricing);
//             }
//
//             const updatedProduct = await productDAO.update(id, productData);
//
//             if (!updatedProduct) {
//                 throw ApiError.notFound('Product not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success(updatedProduct, 'Product updated successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Delete product
//      * @route   DELETE /api/products/:id
//      * @access  Private (Admin/Artist)
//      */
//     async deleteProduct(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//
//             const productDAO = req.db?.getProductDAO();
//             if (!productDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const deleted = await productDAO.delete(id);
//
//             if (!deleted) {
//                 throw ApiError.notFound('Product not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success({ deleted: true }, 'Product deleted successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Search products by title
//      * @route   GET /api/products/search
//      * @access  Public
//      */
//     async searchProductsByTitle(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { title } = req.query;
//
//             if (!title || typeof title !== 'string') {
//                 throw ApiError.badRequest('Title query parameter is required');
//             }
//
//             const productDAO = req.db?.getProductDAO();
//             if (!productDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const products = await productDAO.findByTitle(title);
//
//             res.status(200).json(
//                 ApiResponse.success(products, 'Products retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Get products by date range
//      * @route   GET /api/products/date-range
//      * @access  Public
//      */
//     async getProductsByDateRange(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { startDate, endDate } = req.query;
//
//             if (!startDate || !endDate || typeof startDate !== 'string' || typeof endDate !== 'string') {
//                 throw ApiError.badRequest('Start date and end date are required');
//             }
//
//             const start = new Date(startDate);
//             const end = new Date(endDate);
//
//             if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//                 throw ApiError.badRequest('Invalid date format');
//             }
//
//             const productDAO = req.db?.getProductDAO();
//             if (!productDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const products = await productDAO.findByDateRange(start, end);
//
//             res.status(200).json(
//                 ApiResponse.success(products, 'Products retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     // Pricing Methods
//
//     /**
//      * @desc    Update product pricing
//      * @route   PUT /api/products/:id/pricing
//      * @access  Private (Admin/Artist)
//      */
//     async updateProductPricing(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//             const pricingData: Partial<PricingDTO> = req.body;
//
//             // Validate pricing data
//             this.validatePricingData(pricingData);
//
//             const productDAO = req.db?.getProductDAO();
//             if (!productDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Get existing product
//             const existingProduct = await productDAO.findById(id);
//             if (!existingProduct) {
//                 throw ApiError.notFound('Product not found');
//             }
//
//             // Update only the pricing field
//             const updatedProduct = await productDAO.update(id, {
//                 pricing: {
//                     ...existingProduct.pricing,
//                     ...pricingData
//                 }
//             });
//
//             if (!updatedProduct) {
//                 throw ApiError.notFound('Product not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success(updatedProduct, 'Product pricing updated successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Get product pricing
//      * @route   GET /api/products/:id/pricing
//      * @access  Public
//      */
//     async getProductPricing(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//
//             const productDAO = req.db?.getProductDAO();
//             if (!productDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const product = await productDAO.findById(id);
//
//             if (!product) {
//                 throw ApiError.notFound('Product not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success(product.pricing, 'Product pricing retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Compare pricing between products
//      * @route   GET /api/products/compare-pricing
//      * @access  Public
//      */
//     async compareProductsPricing(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { productIds } = req.query;
//
//             if (!productIds || typeof productIds !== 'string') {
//                 throw ApiError.badRequest('Product IDs are required (comma-separated)');
//             }
//
//             const ids = productIds.split(',').map(id => id.trim());
//
//             if (ids.length < 2) {
//                 throw ApiError.badRequest('At least two product IDs are required for comparison');
//             }
//
//             const productDAO = req.db?.getProductDAO();
//             if (!productDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const pricingComparison: Array<{
//                 productId: string;
//                 title: string;
//                 pricing: PricingDTO;
//             }> = [];
//
//             for (const id of ids) {
//                 const product = await productDAO.findById(id);
//
//                 if (!product) {
//                     throw ApiError.notFound(`Product with ID ${id} not found`);
//                 }
//
//                 pricingComparison.push({
//                     productId: product.id,
//                     title: product.title,
//                     pricing: product.pricing
//                 });
//             }
//
//             res.status(200).json(
//                 ApiResponse.success(pricingComparison, 'Product pricing comparison retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * Helper method to validate pricing data
//      */
//     private validatePricingData(pricing: Partial<PricingDTO>): void {
//         // Check if at least one pricing value is provided
//         if (!pricing || Object.keys(pricing).length === 0) {
//             throw ApiError.badRequest('At least one pricing value is required');
//         }
//
//         // Validate that all provided pricing values are non-negative numbers
//         for (const [key, value] of Object.entries(pricing)) {
//             if (typeof value !== 'number' || value < 0) {
//                 throw ApiError.badRequest(`Invalid ${key} price: must be a non-negative number`);
//             }
//         }
//     }
// }