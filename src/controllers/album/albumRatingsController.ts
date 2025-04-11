import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';
import { RatingDTO } from "../../dto/RatingDTO";

/**
 * @desc    Get album ratings and reviews
 * @route   GET /api/album/ratings
 * @access  Public
 */
export const albumRatingsController = async (req: Request, res: Response) => {
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

        const ratings = await albumDAO.getRatings(album);

        let averageRating = 0;
        if (ratings && ratings.length > 0) {
            averageRating = ratings.reduce((sum: number, rating: RatingDTO) => sum + rating.rating, 0) / ratings.length;
        }

        const response = {
            album: {
                id: album._id,
                title: album.title
            },
            ratings: ratings || [],
            averageRating,
            totalRatings: ratings ? ratings.length : 0
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