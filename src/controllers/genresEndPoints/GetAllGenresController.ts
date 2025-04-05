// import { Request, Response, NextFunction } from 'express';
// import { ApiResponse } from '../../../utils/ApiResponse';
// import { ApiError } from '../../../utils/ApiError';
//
// export class GenreGetAllController {
//     /**
//      * @desc    Get all genres
//      * @route   GET /api/genres
//      * @access  Public
//      */
//     async getAllGenres(req: Request, res: Response, next: NextFunction) {
//         try {
//             const genreDAO = req.db?.getGenreDAO();
//             if (!genreDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const genres = await genreDAO.findAll();
//
//             res.status(200).json(
//                 ApiResponse.success(genres, 'Genres retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
// }