import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { MapperUtils } from '../../utils/MapperUtils';

export class RatingCreationController {
    /**
     * @desc    Create a new rating for a product
     * @route   POST /api/ratings/create
     * @access  Private (authenticated users)
     */
    async createRating(req: Request, res: Response, next: NextFunction) {
        try {
            const ratingData = req.body;

            // Validate rating value
            if (ratingData.rating < 1 || ratingData.rating > 5) {
                throw ApiError.badRequest('Rating must be between 1 and 5');
            }

            const ratingDAO = req.db?.getRatingDAO();
            if (!ratingDAO) {
                throw ApiError.internal('Database access error');
            }

            // Verify user exists
            // Se asume que habrá un UserDAO pero no se implementa para este ejercicio
            // const userDAO = req.db?.getUserDAO();
            // if (!userDAO) {
            //     throw ApiError.internal('Database access error');
            // }
            //
            // const user = await userDAO.findById(ratingData.author);
            // if (!user) {
            //     throw ApiError.badRequest('Invalid author ID');
            // }

            // Verify product exists
            const productDAO = req.db?.getProductDAO();
            if (!productDAO) {
                throw ApiError.internal('Database access error');
            }

            const product = await productDAO.findById(ratingData.product);
            if (!product) {
                throw ApiError.badRequest('Invalid product ID');
            }

            // Check if user has already rated this product
            const existingRating = await ratingDAO.findByProductAndAuthor(
                ratingData.product,
                ratingData.author
            );

            if (existingRating) {
                throw ApiError.conflict('User has already rated this product');
            }

            // Set publish date to current date
            const newRating = await ratingDAO.create({
                ...ratingData,
                publish_date: new Date()
            });

            // Convert to DTO for response
            const ratingDTO = MapperUtils.toRatingDTO(newRating);

            res.status(201).json(
                ApiResponse.created(ratingDTO, 'Rating created successfully')
            );
        } catch (error) {
            next(error);
        }
    }
}