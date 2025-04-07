import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

/**
 * @desc    Get all genres
 * @route   GET /api/getAllGenres
 * @access  Public
 */
export const getAllGenres = async (req: Request, res: Response) => {
    try {
        const genreDAO = new MongoDBDAOFactory().createGenreDAO();

        const genres = await genreDAO.getAll();

        res.status(200).json({
            success: true,
            msg: 'Genres retrieved successfully',
            data: genres
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        res.status(500).json({
            success: false,
            error: {
                message: errorMessage,
                code: 'GENRE_FETCH_ERROR'
            }
        });
    }
};