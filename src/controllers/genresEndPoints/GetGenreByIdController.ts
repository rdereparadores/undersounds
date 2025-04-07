import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

/**
 * @desc    Get genre by ID
 * @route   GET /api/getGenreById
 * @access  Public
 */
export const getGenreById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const genreDAO = new MongoDBDAOFactory().createGenreDAO();

        const genre = await genreDAO.findById(id);

        if (!genre) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Genre not found',
                    code: 'GENRE_NOT_FOUND'
                }
            });
        }

        res.status(200).json({
            success: true,
            msg: 'Genre retrieved successfully',
            data: genre
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