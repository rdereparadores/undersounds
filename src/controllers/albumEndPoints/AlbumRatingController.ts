import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

/**
 * @desc    Get album ratings and reviews
 * @route   GET /api/albums/ratings
 * @access  Public
 */
export const getAlbumRatings = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Album ID is required',
                    code: 'ALBUM_ID_REQUIRED'
                }
            });
        }

        const factory = new MongoDBDAOFactory();
        const albumDAO = factory.createAlbumDAO();

        const album = await albumDAO.findById(id);
        if (!album) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Album not found',
                    code: 'ALBUM_NOT_FOUND'
                }
            });
        }

        const ratingDAO = factory.createRatingDAO();

        const ratings = await ratingDAO.findByProduct(id);

        const averageRating = await ratingDAO.getAverageRatingForProduct(id);


        const response = {
            album: {
                id: album._id.toString(),
                title: album.title
            },
            ratings: ratings, // Ya son DTOs
            averageRating,
            totalRatings: ratings.length
        };

        res.status(200).json({
            success: true,
            msg: 'Album ratings retrieved successfully',
            data: response
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        res.status(500).json({
            success: false,
            error: {
                message: errorMessage,
                code: 'RATINGS_FETCH_ERROR'
            }
        });
    }
};