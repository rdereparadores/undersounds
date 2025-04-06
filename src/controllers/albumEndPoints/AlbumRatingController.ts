import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { MapperUtils } from '../../utils/MapperUtils';

export class AlbumRatingController {
    /**
     * @desc    Get album ratings and reviews
     * @route   GET /api/albums/ratings
     * @access  Public
     */
    async getAlbumRatings(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.query;

            if (!id || typeof id !== 'string') {
                throw ApiError.badRequest('Album ID is required');
            }

            const albumDAO = req.db?.getAlbumDAO();
            if (!albumDAO) {
                throw ApiError.internal('Database access error');
            }

            // Verify album exists
            const album = await albumDAO.findById(id);
            if (!album) {
                throw ApiError.notFound('Album not found');
            }

            const ratingDAO = req.db?.getRatingDAO();
            if (!ratingDAO) {
                throw ApiError.internal('Database access error');
            }

            // Get all ratings for this album
            const ratings = await ratingDAO.findByProduct(id);

            // Get average rating
            const averageRating = await ratingDAO.getAverageRatingForProduct(id);

            // Convert ratings to DTOs
            const ratingDTOs = ratings.map(rating => MapperUtils.toRatingDTO(rating));

            const response = {
                album: {
                    id: album._id.toString(),
                    title: album.title
                },
                ratings: ratingDTOs,
                averageRating,
                totalRatings: ratings.length
            };

            res.status(200).json(
                ApiResponse.success(response, 'Album ratings retrieved successfully')
            );
        } catch (error) {
            next(error);
        }
    }
}