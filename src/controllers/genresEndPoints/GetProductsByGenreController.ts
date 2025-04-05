// import { Request, Response, NextFunction } from 'express';
// import { ApiResponse } from '../../utils/ApiResponse';
// import { ApiError } from '../../utils/ApiError';
//
// export class GenreGetProductsController {
//     /**
//      * @desc    Get products by genre
//      * @route   GET /api/genres/:id/products
//      * @access  Public
//      */
//     async getProductsByGenre(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//             const { page = '1', limit = '10', productType } = req.query;
//
//             const pageNumber = parseInt(page as string);
//             const limitNumber = parseInt(limit as string);
//
//             if (isNaN(pageNumber) || pageNumber < 1) {
//                 throw ApiError.badRequest('Page must be a positive number');
//             }
//
//             if (isNaN(limitNumber) || limitNumber < 1) {
//                 throw ApiError.badRequest('Limit must be a positive number');
//             }
//
//             // Verify genre exists
//             const genreDAO = req.db?.getGenreDAO();
//             if (!genreDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const genre = await genreDAO.findById(id);
//             if (!genre) {
//                 throw ApiError.notFound('Genre not found');
//             }
//
//             // Get products by genre
//             let products;
//             let totalProducts;
//             const skip = (pageNumber - 1) * limitNumber;
//
//             if (productType === 'song') {
//                 const songDAO = req.db?.getSongDAO();
//                 if (!songDAO) {
//                     throw ApiError.internal('Database access error');
//                 }
//
//                 products = await songDAO.findByGenrePaginated(id, skip, limitNumber);
//                 totalProducts = await songDAO.countByGenre(id);
//             } else if (productType === 'album') {
//                 const albumDAO = req.db?.getAlbumDAO();
//                 if (!albumDAO) {
//                     throw ApiError.internal('Database access error');
//                 }
//
//                 products = await albumDAO.findByGenrePaginated(id, skip, limitNumber);
//                 totalProducts = await albumDAO.countByGenre(id);
//             } else {
//                 // If no specific product type, get all products with this genre
//                 const productDAO = req.db?.getProductDAO();
//                 if (!productDAO) {
//                     throw ApiError.internal('Database access error');
//                 }
//
//                 products = await productDAO.findByGenrePaginated(id, skip, limitNumber);
//                 totalProducts = await productDAO.countByGenre(id);
//             }
//
//             const totalPages = Math.ceil(totalProducts / limitNumber);
//
//             const response = {
//                 genre,
//                 products,
//                 pagination: {
//                     currentPage: pageNumber,
//                     totalPages,
//                     totalItems: totalProducts,
//                     hasNextPage: pageNumber < totalPages,
//                     hasPrevPage: pageNumber > 1
//                 }
//             };
//
//             res.status(200).json(
//                 ApiResponse.success(response, 'Products by genre retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
// }