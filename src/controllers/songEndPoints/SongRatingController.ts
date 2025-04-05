// import { Request, Response, NextFunction } from 'express';
// import { ApiResponse } from '../../utils/ApiResponse';
// import { ApiError } from '../../utils/ApiError';
//
// export class SongInfoController {
//     /**
//      * @desc    Get song information including title, artists, prices, recommendations
//      * @route   GET /api/song/info
//      * @access  Public
//      */
//     async getSongInfo(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.query;
//
//             if (!id || typeof id !== 'string') {
//                 throw ApiError.badRequest('Song ID is required');
//             }
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
//             // Get recommendations based on this song
//             const recommendations = await songDAO.findRecommendations(id, 5); // Get 5 recommendations
//
//             // Get pricing info if needed
//             // This info is available from song object if pricing is stored there,
//             // otherwise you might need to fetch it from ProductDAO if songs are products
//
//             // Construct response object with all the required info
//             const response = {
//                 song,
//                 recommendations
//             };
//
//             res.status(200).json(
//                 ApiResponse.success(response, 'Song information retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
// }