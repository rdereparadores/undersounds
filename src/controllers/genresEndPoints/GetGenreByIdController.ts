import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';

export class GenreGetByIdController {
    /**
     * @desc    Get genre by ID
     * @route   GET /api/genres/:id
     * @access  Public
     */
    async getGenreById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const genreDAO = new GenreDAO();

            const genre = await genreDAO.findById(id);

            if (!genre) {
                throw ApiError.notFound('Genre not found');
            }

            res.status(200).json(
                ApiResponse.success(genre, 'Genre retrieved successfully')
            );
        } catch (error) {
            next(error);
        }
    }
}

