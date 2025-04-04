// import { Request, Response, NextFunction } from 'express';
// import { ApiResponse } from '../utils/ApiResponse';
// import { ApiError } from '../utils/ApiError';
// import { CreateSongDTO, UpdateSongDTO, SongCollaboratorDTO, SongGenreDTO } from '../dto/SongDTO';
//
// export class SongController {
//
//     /**
//      * @desc    Get all songs
//      * @route   GET /api/songs
//      * @access  Public
//      */
//     async getAllSongs(req: Request, res: Response, next: NextFunction) {
//         try {
//             const songDAO = req.db?.getSongDAO();
//             if (!songDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const songs = await songDAO.findAll();
//
//             res.status(200).json(
//                 ApiResponse.success(songs, 'Songs retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Get song by ID
//      * @route   GET /api/songs/:id
//      * @access  Public
//      */
//     async getSongById(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//
//             const songDAO = req.db?.getSongDAO();
//             if (!songDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const song = await songDAO.findById(id);
//
//             if (!song) {
//                 throw ApiError.notFound('Song not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success(song, 'Song retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Create new song
//      * @route   POST /api/songs
//      * @access  Private (Admin/Artist)
//      */
//     async createSong(req: Request, res: Response, next: NextFunction) {
//         try {
//             const songData: CreateSongDTO = req.body;
//
//             const songDAO = req.db?.getSongDAO();
//             if (!songDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Validate performer
//             const artistDAO = req.db?.getArtistDAO();
//             if (!artistDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const performer = await artistDAO.findById(songData.performer);
//             if (!performer) {
//                 throw ApiError.badRequest('Invalid performer ID');
//             }
//
//             // Validate genres
//             const genreDAO = req.db?.getGenreDAO();
//             if (!genreDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             for (const genreId of songData.genres) {
//                 const genre = await genreDAO.findById(genreId);
//                 if (!genre) {
//                     throw ApiError.badRequest(`Invalid genre ID: ${genreId}`);
//                 }
//             }
//
//             // Validate collaborators if provided
//             if (songData.collaborators && songData.collaborators.length > 0) {
//                 for (const collaboratorId of songData.collaborators) {
//                     const collaborator = await artistDAO.findById(collaboratorId);
//                     if (!collaborator) {
//                         throw ApiError.badRequest(`Invalid collaborator ID: ${collaboratorId}`);
//                     }
//                 }
//             }
//
//             const newSong = await songDAO.create(songData);
//
//             res.status(201).json(
//                 ApiResponse.created(newSong, 'Song created successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Update song
//      * @route   PUT /api/songs/:id
//      * @access  Private (Admin/Artist)
//      */
//     async updateSong(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//             const songData: UpdateSongDTO = req.body;
//
//             const songDAO = req.db?.getSongDAO();
//             if (!songDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Validate the song exists
//             const existingSong = await songDAO.findById(id);
//             if (!existingSong) {
//                 throw ApiError.notFound('Song not found');
//             }
//
//             // Validate performer if provided
//             if (songData.performer) {
//                 const artistDAO = req.db?.getArtistDAO();
//                 if (!artistDAO) {
//                     throw ApiError.internal('Database access error');
//                 }
//
//                 const performer = await artistDAO.findById(songData.performer);
//                 if (!performer) {
//                     throw ApiError.badRequest('Invalid performer ID');
//                 }
//             }
//
//             // Validate genres if provided
//             if (songData.genres && songData.genres.length > 0) {
//                 const genreDAO = req.db?.getGenreDAO();
//                 if (!genreDAO) {
//                     throw ApiError.internal('Database access error');
//                 }
//
//                 for (const genreId of songData.genres) {
//                     const genre = await genreDAO.findById(genreId);
//                     if (!genre) {
//                         throw ApiError.badRequest(`Invalid genre ID: ${genreId}`);
//                     }
//                 }
//             }
//
//             const updatedSong = await songDAO.update(id, songData);
//
//             res.status(200).json(
//                 ApiResponse.success(updatedSong, 'Song updated successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Delete song
//      * @route   DELETE /api/songs/:id
//      * @access  Private (Admin/Artist)
//      */
//     async deleteSong(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//
//             const songDAO = req.db?.getSongDAO();
//             if (!songDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const deleted = await songDAO.delete(id);
//
//             if (!deleted) {
//                 throw ApiError.notFound('Song not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success({ deleted: true }, 'Song deleted successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Search songs by title
//      * @route   GET /api/songs/search
//      * @access  Public
//      */
//     async searchSongsByTitle(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { title } = req.query;
//
//             if (!title || typeof title !== 'string') {
//                 throw ApiError.badRequest('Title query parameter is required');
//             }
//
//             const songDAO = req.db?.getSongDAO();
//             if (!songDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const songs = await songDAO.findByTitle(title);
//
//             res.status(200).json(
//                 ApiResponse.success(songs, 'Songs retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Get songs by performer
//      * @route   GET /api/songs/performer/:performerId
//      * @access  Public
//      */
//     async getSongsByPerformer(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { performerId } = req.params;
//
//             const songDAO = req.db?.getSongDAO();
//             if (!songDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const songs = await songDAO.findByPerformer(performerId);
//
//             res.status(200).json(
//                 ApiResponse.success(songs, 'Songs retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Get songs by genre
//      * @route   GET /api/songs/genre/:genreId
//      * @access  Public
//      */
//     async getSongsByGenre(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { genreId } = req.params;
//
//             const songDAO = req.db?.getSongDAO();
//             if (!songDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const songs = await songDAO.findByGenre(genreId);
//
//             res.status(200).json(
//                 ApiResponse.success(songs, 'Songs retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Get most played songs
//      * @route   GET /api/songs/most-played
//      * @access  Public
//      */
//     async getMostPlayedSongs(req: Request, res: Response, next: NextFunction) {
//         try {
//             const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
//
//             if (isNaN(limit) || limit <= 0) {
//                 throw ApiError.badRequest('Limit must be a positive number');
//             }
//
//             const songDAO = req.db?.getSongDAO();
//             if (!songDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const songs = await songDAO.findMostPlayed(limit);
//
//             res.status(200).json(
//                 ApiResponse.success(songs, 'Most played songs retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Increment song plays
//      * @route   POST /api/songs/:id/play
//      * @access  Public
//      */
//     async incrementSongPlays(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//
//             const songDAO = req.db?.getSongDAO();
//             if (!songDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const updatedSong = await songDAO.incrementPlays(id);
//
//             if (!updatedSong) {
//                 throw ApiError.notFound('Song not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success(updatedSong, 'Song play count incremented')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Add collaborator to song
//      * @route   POST /api/songs/:id/collaborators
//      * @access  Private (Admin/Artist)
//      */
//     async addCollaborator(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//             const { artistId }: SongCollaboratorDTO = req.body;
//
//             if (!artistId) {
//                 throw ApiError.badRequest('Artist ID is required');
//             }
//
//             const songDAO = req.db?.getSongDAO();
//             if (!songDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Validate artist
//             const artistDAO = req.db?.getArtistDAO();
//             if (!artistDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const artist = await artistDAO.findById(artistId);
//             if (!artist) {
//                 throw ApiError.badRequest('Invalid artist ID');
//             }
//
//             const updatedSong = await songDAO.addCollaborator(id, artistId);
//
//             if (!updatedSong) {
//                 throw ApiError.notFound('Song not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success(updatedSong, 'Collaborator added successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Remove collaborator from song
//      * @route   DELETE /api/songs/:id/collaborators/:artistId
//      * @access  Private (Admin/Artist)
//      */
//     async removeCollaborator(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id, artistId } = req.params;
//
//             const songDAO = req.db?.getSongDAO();
//             if (!songDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const updatedSong = await songDAO.removeCollaborator(id, artistId);
//
//             if (!updatedSong) {
//                 throw ApiError.notFound('Song not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success(updatedSong, 'Collaborator removed successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Add genre to song
//      * @route   POST /api/songs/:id/genres
//      * @access  Private (Admin/Artist)
//      */
//     async addGenre(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//             const { genreId }: SongGenreDTO = req.body;
//
//             if (!genreId) {
//                 throw ApiError.badRequest('Genre ID is required');
//             }
//
//             const songDAO = req.db?.getSongDAO();
//             if (!songDAO) {
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
//             const updatedSong = await songDAO.addGenre(id, genreId);
//
//             if (!updatedSong) {
//                 throw ApiError.notFound('Song not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success(updatedSong, 'Genre added successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Remove genre from song
//      * @route   DELETE /api/songs/:id/genres/:genreId
//      * @access  Private (Admin/Artist)
//      */
//     async removeGenre(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id, genreId } = req.params;
//
//             const songDAO = req.db?.getSongDAO();
//             if (!songDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             const updatedSong = await songDAO.removeGenre(id, genreId);
//
//             if (!updatedSong) {
//                 throw ApiError.notFound('Song not found');
//             }
//
//             res.status(200).json(
//                 ApiResponse.success(updatedSong, 'Genre removed successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
// }