import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

/**
 * @desc    Get song ratings and reviews
 * @route   GET /api/songs/ratings
 * @access  Public
 */
export const getSongRatings = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Song ID is required',
                    code: 'SONG_ID_REQUIRED'
                }
            });
        }

        const factory = new MongoDBDAOFactory();
        const songDAO = factory.createSongDAO();

        // Verify song exists
        const song = await songDAO.findById(id);
        if (!song) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Song not found',
                    code: 'SONG_NOT_FOUND'
                }
            });
        }

        const ratingDAO = factory.createRatingDAO();

        const ratings = await ratingDAO.findByProduct(id);

        const averageRating = await ratingDAO.getAverageRatingForProduct(id);

        const response = {
            song: {
                id: song._id,
                title: song.title
            },
            ratings: ratings,
            averageRating,
            totalRatings: ratings.length
        };

        res.status(200).json({
            success: true,
            msg: 'Song ratings retrieved successfully',
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