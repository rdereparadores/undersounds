import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

/**
 * @desc    Get top 10 trending songs
 * @route   GET /api/trending/top10
 * @access  Public
 */
export const getTrendingSongs = async (req: Request, res: Response) => {
    try {
        const factory = new MongoDBDAOFactory();
        const songDAO = factory.createSongDAO();

        const trendingSongs = await songDAO.findMostPlayed(10);

        res.status(200).json({
            success: true,
            msg: 'Trending songs retrieved successfully',
            data: trendingSongs
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        res.status(500).json({
            success: false,
            error: {
                message: errorMessage,
                code: 'TRENDING_SONGS_FETCH_ERROR'
            }
        });
    }
};