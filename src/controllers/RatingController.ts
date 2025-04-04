// import { Request, Response, NextFunction } from 'express';
// import { ApiResponse } from '../utils/ApiResponse';
// import { ApiError } from '../utils/ApiError';
// import { CreateRatingDTO, UpdateRatingDTO } from '../dto/RatingDTO';
//
// export class RatingController {
//
//     /**
//      * @desc    Get all ratings
//      * @route   GET /api/ratings
//      * @access  Public
//      */
//     async getAllRatings(req: Request, res: Response, next: NextFunction) {
//         try {
//             const ratingDAO = req.db?.getRatingDAO();
//             if (!ratingDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const ratings = await ratingDAO.findAll();
//
//             res.status(200).json(
//                 ApiResponse.success(ratings, 'Ratings retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Get rating by ID
//      * @route   GET /api/ratings/:id
//      * @access  Public
//      */
//     async getRatingById(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//
//             const ratingDAO = req.db?.getRatingDAO();
//             if (!ratingDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const rating = await ratingDAO.findById(id);
//
//             if (!rating) {
//                 throw ApiError.notFound('Rating not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success(rating, 'Rating retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Get ratings by product
//      * @route   GET /api/ratings/product/:productId
//      * @access  Public
//      */
//     async getRatingsByProduct(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { productId } = req.params;
//
//             const ratingDAO = req.db?.getRatingDAO();
//             if (!ratingDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const ratings = await ratingDAO.findByProduct(productId);
//
//             res.status(200).json(
//                 ApiResponse.success(ratings, 'Ratings retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Get ratings by author (user)
//      * @route   GET /api/ratings/author/:authorId
//      * @access  Public
//      */
//     async getRatingsByAuthor(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { authorId } = req.params;
//
//             const ratingDAO = req.db?.getRatingDAO();
//             if (!ratingDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const ratings = await ratingDAO.findByAuthor(authorId);
//
//             res.status(200).json(
//                 ApiResponse.success(ratings, 'Ratings retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Get average rating for product
//      * @route   GET /api/ratings/average/:productId
//      * @access  Public
//      */
//     async getAverageRating(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { productId } = req.params;
//
//             const ratingDAO = req.db?.getRatingDAO();
//             if (!ratingDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Verify product exists
//             const productDAO = req.db?.getProductDAO();
//             if (!productDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const product = await productDAO.findById(productId);
//             if (!product) {
//                 throw ApiError.notFound('Product not found');
//             }
//
//             const averageRating = await ratingDAO.getAverageRatingForProduct(productId);
//             const ratings = await ratingDAO.findByProduct(productId);
//
//             res.status(200).json(
//                 ApiResponse.success({
//                     productId,
//                     averageRating,
//                     totalRatings: ratings.length
//                 }, 'Average rating retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Create new rating
//      * @route   POST /api/ratings
//      * @access  Private (authenticated users)
//      */
//     async createRating(req: Request, res: Response, next: NextFunction) {
//         try {
//             const ratingData: CreateRatingDTO = req.body;
//
//             // Validate rating value
//             if (ratingData.rating < 1 || ratingData.rating > 5) {
//                 throw ApiError.badRequest('Rating must be between 1 and 5');
//             }
//
//             const ratingDAO = req.db?.getRatingDAO();
//             if (!ratingDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Verify user exists
//             const userDAO = req.db?.getUserDAO();
//             if (!userDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const user = await userDAO.findById(ratingData.author);
//             if (!user) {
//                 throw ApiError.badRequest('Invalid author ID');
//             }
//
//             // Verify product exists
//             const productDAO = req.db?.getProductDAO();
//             if (!productDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const product = await productDAO.findById(ratingData.product);
//             if (!product) {
//                 throw ApiError.badRequest('Invalid product ID');
//             }
//
//             // Check if user has already rated this product
//             const existingRating = await ratingDAO.findByProductAndAuthor(
//                 ratingData.product,
//                 ratingData.author
//             );
//
//             if (existingRating) {
//                 throw ApiError.conflict('User has already rated this product');
//             }
//
//             // Set publish date to current date
//             const newRating = await ratingDAO.create({
//                 ...ratingData,
//                 publish_date: new Date()
//             });
//
//             res.status(201).json(
//                 ApiResponse.created(newRating, 'Rating created successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Update rating
//      * @route   PUT /api/ratings/:id
//      * @access  Private (rating author or admin)
//      */
//     async updateRating(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//             const ratingData: UpdateRatingDTO = req.body;
//
//             // Validate rating value if provided
//             if (ratingData.rating !== undefined && (ratingData.rating < 1 || ratingData.rating > 5)) {
//                 throw ApiError.badRequest('Rating must be between 1 and 5');
//             }
//
//             const ratingDAO = req.db?.getRatingDAO();
//             if (!ratingDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Verify rating exists
//             const existingRating = await ratingDAO.findById(id);
//             if (!existingRating) {
//                 throw ApiError.notFound('Rating not found');
//             }
//
//             // Authorize user (rating author or admin)
//             // This would normally check req.user.id against existingRating.author
//             // and req.user.role for admin privileges
//
//             const updatedRating = await ratingDAO.update(id, ratingData);
//
//             res.status(200).json(
//                 ApiResponse.success(updatedRating, 'Rating updated successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Delete rating
//      * @route   DELETE /api/ratings/:id
//      * @access  Private (rating author or admin)
//      */
//     async deleteRating(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//
//             const ratingDAO = req.db?.getRatingDAO();
//             if (!ratingDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Verify rating exists
//             const existingRating = await ratingDAO.findById(id);
//             if (!existingRating) {
//                 throw ApiError.notFound('Rating not found');
//             }
//
//             // Authorize user (rating author or admin)
//             // This would normally check req.user.id against existingRating.author
//             // and req.user.role for admin privileges
//
//             const deleted = await ratingDAO.delete(id);
//
//             res.status(200).json(
//                 ApiResponse.success({ deleted }, 'Rating deleted successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
// }