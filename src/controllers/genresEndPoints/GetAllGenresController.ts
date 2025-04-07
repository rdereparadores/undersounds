import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { GenreDAO } from '../../dao/GenreDAO';

export class GenreGetAllController {
    /**
     * @desc    Get all genres
     * @route   GET /api/genres
     * @access  Public
     */
    async getAllGenres(req: Request, res: Response, next: NextFunction) {
        try {
            const genreDAO = new GenreDAO();

            const genres = await genreDAO.getAll();

            res.status(200).json(
                ApiResponse.success(genres, 'Genres retrieved successfully')
            );
        } catch (error) {
            next(error);
        }
    }
}