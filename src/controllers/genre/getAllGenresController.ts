import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

/**
 * @desc    Get all genres
 * @route   GET /api/genres/getAllGenres
 * @access  Public
 */
export const genreAllController = async (req: Request, res: Response) => {
    try {
        const genreDAO = new MongoDBDAOFactory().createGenreDAO()

        const genres = await genreDAO.getAll()

        res.status(200).json({
            msg: genres.map(genre => genre.genre)
        });

    } catch (_error) {
        res.status(500).json({
            err: 'GENRE_FETCH_ERROR'
        });
    }
};