// import { Request, Response, NextFunction } from 'express';
// import { ApiResponse } from '../utils/ApiResponse';
// import { ApiError } from '../utils/ApiError';
// import { CreateAlbumDTO, UpdateAlbumDTO, AlbumSongDTO, AlbumGenreDTO } from '../dto/AlbumDTO';
//
// export class AlbumController {
//
//     /**
//      * @desc    Get all albums
//      * @route   GET /api/albums
//      * @access  Public
//      */
//     async getAllAlbums(req: Request, res: Response, next: NextFunction) {
//         try {
//             const albumDAO = req.db?.getAlbumDAO();
//             if (!albumDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const albums = await albumDAO.findAll();
//
//             res.status(200).json(
//                 ApiResponse.success(albums, 'Albums retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Get album by ID
//      * @route   GET /api/albums/:id
//      * @access  Public
//      */
//     async getAlbumById(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//
//             const albumDAO = req.db?.getAlbumDAO();
//             if (!albumDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const album = await albumDAO.findById(id);
//
//             if (!album) {
//                 throw ApiError.notFound('Album not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success(album, 'Album retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Create new album
//      * @route   POST /api/albums
//      * @access  Private (Admin/Artist)
//      */
//     async createAlbum(req: Request, res: Response, next: NextFunction) {
//         try {
//             const albumData: CreateAlbumDTO = req.body;
//
//             const albumDAO = req.db?.getAlbumDAO();
//             if (!albumDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Validate track list if provided
//             if (albumData.track_list && albumData.track_list.length > 0) {
//                 const songDAO = req.db?.getSongDAO();
//                 if (!songDAO) {
//                     throw ApiError.internal('Database access error');
//                 }
//
//                 for (const songId of albumData.track_list) {
//                     const song = await songDAO.findById(songId);
//                     if (!song) {
//                         throw ApiError.badRequest(`Invalid song ID: ${songId}`);
//                     }
//                 }
//             }
//
//             // Validate genres if provided
//             if (albumData.genres && albumData.genres.length > 0) {
//                 const genreDAO = req.db?.getGenreDAO();
//                 if (!genreDAO) {
//                     throw ApiError.internal('Database access error');
//                 }
//
//                 for (const genreId of albumData.genres) {
//                     const genre = await genreDAO.findById(genreId);
//                     if (!genre) {
//                         throw ApiError.badRequest(`Invalid genre ID: ${genreId}`);
//                     }
//                 }
//             }
//
//             const newAlbum = await albumDAO.create({
//                 ...albumData,
//                 release_date: new Date(albumData.release_date),
//                 product_type: 'Album' // Set discriminator value
//             });
//
//             res.status(201).json(
//                 ApiResponse.created(newAlbum, 'Album created successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Update album
//      * @route   PUT /api/albums/:id
//      * @access  Private (Admin/Artist)
//      */
//     async updateAlbum(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//             const albumData: UpdateAlbumDTO = req.body;
//
//             // Convert release_date string to Date if provided
//             if (albumData.release_date) {
//                 albumData.release_date = new Date(albumData.release_date);
//             }
//
//             const albumDAO = req.db?.getAlbumDAO();
//             if (!albumDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Check if album exists
//             const existingAlbum = await albumDAO.findById(id);
//             if (!existingAlbum) {
//                 throw ApiError.notFound('Album not found');
//             }
//
//             // Validate track list if provided
//             if (albumData.track_list && albumData.track_list.length > 0) {
//                 const songDAO = req.db?.getSongDAO();
//                 if (!songDAO) {
//                     throw ApiError.internal('Database access error');
//                 }
//
//                 for (const songId of albumData.track_list) {
//                     const song = await songDAO.findById(songId);
//                     if (!song) {
//                         throw ApiError.badRequest(`Invalid song ID: ${songId}`);
//                     }
//                 }
//             }
//
//             // Validate genres if provided
//             if (albumData.genres && albumData.genres.length > 0) {
//                 const genreDAO = req.db?.getGenreDAO();
//                 if (!genreDAO) {
//                     throw ApiError.internal('Database access error');
//                 }
//
//                 for (const genreId of albumData.genres) {
//                     const genre = await genreDAO.findById(genreId);
//                     if (!genre) {
//                         throw ApiError.badRequest(`Invalid genre ID: ${genreId}`);
//                     }
//                 }
//             }
//
//             const updatedAlbum = await albumDAO.update(id, albumData);
//
//             if (!updatedAlbum) {
//                 throw ApiError.notFound('Album not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success(updatedAlbum, 'Album updated successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Delete album
//      * @route   DELETE /api/albums/:id
//      * @access  Private (Admin/Artist)
//      */
//     async deleteAlbum(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//
//             const albumDAO = req.db?.getAlbumDAO();
//             if (!albumDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const deleted = await albumDAO.delete(id);
//
//             if (!deleted) {
//                 throw ApiError.notFound('Album not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success({ deleted: true }, 'Album deleted successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Search albums by title
//      * @route   GET /api/albums/search
//      * @access  Public
//      */
//     async searchAlbumsByTitle(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { title } = req.query;
//
//             if (!title || typeof title !== 'string') {
//                 throw ApiError.badRequest('Title query parameter is required');
//             }
//
//             const albumDAO = req.db?.getAlbumDAO();
//             if (!albumDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const albums = await albumDAO.findByTitle(title);
//
//             res.status(200).json(
//                 ApiResponse.success(albums, 'Albums retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Get albums by genre
//      * @route   GET /api/albums/genre/:genreId
//      * @access  Public
//      */
//     async getAlbumsByGenre(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { genreId } = req.params;
//
//             const albumDAO = req.db?.getAlbumDAO();
//             if (!albumDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const albums = await albumDAO.findByGenre(genreId);
//
//             res.status(200).json(
//                 ApiResponse.success(albums, 'Albums retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Get albums by date range
//      * @route   GET /api/albums/date-range
//      * @access  Public
//      */
//     async getAlbumsByDateRange(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { startDate, endDate } = req.query;
//
//             if (!startDate || !endDate || typeof startDate !== 'string' || typeof endDate !== 'string') {
//                 throw ApiError.badRequest('Start date and end date are required');
//             }
//
//             const start = new Date(startDate);
//             const end = new Date(endDate);
//
//             if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//                 throw ApiError.badRequest('Invalid date format');
//             }
//
//             const albumDAO = req.db?.getAlbumDAO();
//             if (!albumDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const albums = await albumDAO.findByDateRange(start, end);
//
//             res.status(200).json(
//                 ApiResponse.success(albums, 'Albums retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Add song to album
//      * @route   POST /api/albums/:id/songs
//      * @access  Private (Admin/Artist)
//      */
//     async addSongToAlbum(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//             const { songId }: AlbumSongDTO = req.body;
//
//             if (!songId) {
//                 throw ApiError.badRequest('Song ID is required');
//             }
//
//             const albumDAO = req.db?.getAlbumDAO();
//             if (!albumDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Validate song
//             const songDAO = req.db?.getSongDAO();
//             if (!songDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const song = await songDAO.findById(songId);
//             if (!song) {
//                 throw ApiError.badRequest('Invalid song ID');
//             }
//
//             const updatedAlbum = await albumDAO.addSongToAlbum(id, songId);
//
//             if (!updatedAlbum) {
//                 throw ApiError.notFound('Album not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success(updatedAlbum, 'Song added to album successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Remove song from album
//      * @route   DELETE /api/albums/:id/songs/:songId
//      * @access  Private (Admin/Artist)
//      */
//     async removeSongFromAlbum(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id, songId } = req.params;
//
//             const albumDAO = req.db?.getAlbumDAO();
//             if (!albumDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const updatedAlbum = await albumDAO.removeSongFromAlbum(id, songId);
//
//             if (!updatedAlbum) {
//                 throw ApiError.notFound('Album not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success(updatedAlbum, 'Song removed from album successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Add genre to album
//      * @route   POST /api/albums/:id/genres
//      * @access  Private (Admin/Artist)
//      */
//     async addGenreToAlbum(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//             const { genreId }: AlbumGenreDTO = req.body;
//
//             if (!genreId) {
//                 throw ApiError.badRequest('Genre ID is required');
//             }
//
//             const albumDAO = req.db?.getAlbumDAO();
//             if (!albumDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Validate genre
//             const genreDAO = req.db?.getGenreDAO();
//             if (!genreDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const genre = await genreDAO.findById(genreId);
//             if (!genre) {
//                 throw ApiError.badRequest('Invalid genre ID');
//             }
//
//             const updatedAlbum = await albumDAO.addGenreToAlbum(id, genreId);
//
//             if (!updatedAlbum) {
//                 throw ApiError.notFound('Album not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success(updatedAlbum, 'Genre added to album successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Remove genre from album
//      * @route   DELETE /api/albums/:id/genres/:genreId
//      * @access  Private (Admin/Artist)
//      */
//     async removeGenreFromAlbum(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id, genreId } = req.params;
//
//             const albumDAO = req.db?.getAlbumDAO();
//             if (!albumDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const updatedAlbum = await albumDAO.removeGenreFromAlbum(id, genreId);
//
//             if (!updatedAlbum) {
//                 throw ApiError.notFound('Album not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success(updatedAlbum, 'Genre removed from album successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
// }