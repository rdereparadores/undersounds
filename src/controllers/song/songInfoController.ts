import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

/**
 * @desc    Get song information including title, artists, prices, recommendations
 * @route   GET /api/songs/info
 * @access  Public
 */
export const getSongInfo = async (req: Request, res: Response) => {
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

        const recommendationsList = await songDAO.getRecommendations(id, 5);

        const response = {
            song: song,
            recommendations: recommendationsList
        };

        res.status(200).json({
            success: true,
            msg: 'Song information retrieved successfully',
            data: response
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        res.status(500).json({
            success: false,
            error: {
                message: errorMessage,
                code: 'SONG_FETCH_ERROR'
            }
        });
    }
};