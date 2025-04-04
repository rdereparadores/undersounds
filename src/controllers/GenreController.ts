// import { Request, Response, NextFunction } from 'express';
// import { ApiResponse } from '../utils/ApiResponse';
// import { ApiError } from '../utils/ApiError';
// import { CreateGenreDTO, UpdateGenreDTO } from '../dto/GenreDTO';
//
// export class GenreController {
//
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
//
//     /**
//      * @desc    Get genre by ID
//      * @route   GET /api/genres/:id
//      * @access  Public
//      */
//     async getGenreById(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//
//             const genreDAO = req.db?.getGenreDAO();
//             if (!genreDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const genre = await genreDAO.findById(id);
//
//             if (!genre) {
//                 throw ApiError.notFound('Genre not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success(genre, 'Genre retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Create new genre
//      * @route   POST /api/genres
//      * @access  Private (Admin)
//      */
//     async createGenre(req: Request, res: Response, next: NextFunction) {
//         try {
//             const genreData: CreateGenreDTO = req.body;
//
//             if (!genreData.genre || genreData.genre.trim() === '') {
//                 throw ApiError.badRequest('Genre name is required');
//             }
//
//             const genreDAO = req.db?.getGenreDAO();
//             if (!genreDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Check if genre already exists
//             const existingGenre = await genreDAO.findByName(genreData.genre);
//             if (existingGenre) {
//                 throw ApiError.conflict('Genre already exists');
//             }
//
//             const newGenre = await genreDAO.create({
//                 genre: genreData.genre.trim()
//             });
//
//             res.status(201).json(
//                 ApiResponse.created(newGenre, 'Genre created successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Update genre
//      * @route   PUT /api/genres/:id
//      * @access  Private (Admin)
//      */
//     async updateGenre(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//             const genreData: UpdateGenreDTO = req.body;
//
//             if (genreData.genre && genreData.genre.trim() === '') {
//                 throw ApiError.badRequest('Genre name cannot be empty');
//             }
//
//             const genreDAO = req.db?.getGenreDAO();
//             if (!genreDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Check if genre exists
//             const existingGenre = await genreDAO.findById(id);
//             if (!existingGenre) {
//                 throw ApiError.notFound('Genre not found');
//             }
//
//             // If updating name, check if new name already exists
//             if (genreData.genre && genreData.genre !== existingGenre.genre) {
//                 const duplicateGenre = await genreDAO.findByName(genreData.genre);
//                 if (duplicateGenre && duplicateGenre.id !== id) {
//                     throw ApiError.conflict('Genre name already exists');
//                 }
//             }
//
//             if (genreData.genre) {
//                 genreData.genre = genreData.genre.trim();
//             }
//
//             const updatedGenre = await genreDAO.update(id, genreData);
//
//             res.status(200).json(
//                 ApiResponse.success(updatedGenre, 'Genre updated successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Delete genre
//      * @route   DELETE /api/genres/:id
//      * @access  Private (Admin)
//      */
//     async deleteGenre(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//
//             const genreDAO = req.db?.getGenreDAO();
//             if (!genreDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Check if genre exists
//             const existingGenre = await genreDAO.findById(id);
//             if (!existingGenre) {
//                 throw ApiError.notFound('Genre not found');
//             }
//
//             // Check if genre is in use (optional, could be implemented if needed)
//             // This would require checking all songs and albums that use this genre
//
//             const deleted = await genreDAO.delete(id);
//
//             res.status(200).json(
//                 ApiResponse.success({ deleted }, 'Genre deleted successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Search genre by name
//      * @route   GET /api/genres/search
//      * @access  Public
//      */
//     async searchGenreByName(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { name } = req.query;
//
//             if (!name || typeof name !== 'string') {
//                 throw ApiError.badRequest('Name query parameter is required');
//             }
//
//             const genreDAO = req.db?.getGenreDAO();
//             if (!genreDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const genre = await genreDAO.findByName(name);
//
//             if (!genre) {
//                 return res.status(200).json(
//                     ApiResponse.success(null, 'No genre found with that name')
//                 );
//             }
//
//             res.status(200).json(
//                 ApiResponse.success(genre, 'Genre retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
// }