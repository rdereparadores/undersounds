// import { Request, Response, NextFunction } from 'express';
// import { ApiResponse } from '../../utils/ApiResponse';
// import { ApiError } from '../../utils/ApiError';
// import { PricingDTO } from '../../dto/ProductDTO';
//
// export class PricingUpdateController {
//     /**
//      * @desc    Update product pricing (admin only)
//      * @route   PUT /api/pricing/:productId
//      * @access  Private (Admin)
//      */
//     async updateProductPricing(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { productId } = req.params;
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
//             const existingProduct = await productDAO.findById(productId);
//             if (!existingProduct) {
//                 throw ApiError.notFound('Product not found');
//             }
//
//             // Update only the pricing field
//             const updatedProduct = await productDAO.update(productId, {
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