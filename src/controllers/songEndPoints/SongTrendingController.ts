// import { Request, Response, NextFunction } from 'express';
// import { ApiResponse } from '../../../utils/ApiResponse';
// import { ApiError } from '../../../utils/ApiError';
//
// export class SongTrendingController {
//     /**
//      * @desc    Get top 10 trending songs
//      * @route   GET /api/trending/songs
//      * @access  Public
//      */
//     async getTrendingSongs(req: Request, res: Response, next: NextFunction) {
//         try {
//             const songDAO = req.db?.getSongDAO();
//             if (!songDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Get the top 10 most played songs
//             const trendingSongs = await songDAO.findMostPlayed(10);
//
//             res.status(200).json(
//                 ApiResponse.success(trendingSongs, 'Trending songs retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
// }