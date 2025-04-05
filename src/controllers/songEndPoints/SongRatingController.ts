// import { Request, Response, NextFunction } from 'express';
// import { ApiResponse } from '../../../utils/ApiResponse';
// import { ApiError } from '../../../utils/ApiError';
// import { MapperUtils } from '../../../utils/MapperUtils';
//
// export class SongRatingController {
//     /**
//      * @desc    Get song ratings and reviews
//      * @route   GET /api/songs/ratings
//      * @access  Public
//      */
//     async getSongRatings(req: Request, res: Response, next: NextFunction) {
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
//             // Verify song exists
//             const song = await songDAO.findById(id);
//             if (!song) {
//                 throw ApiError.notFound('Song not found');
//             }
//
//             const ratingDAO = req.db?.getRatingDAO();
//             if (!ratingDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Get all ratings for this song
//             const ratings = await ratingDAO.findByProduct(id);
//
//             // Get average rating
//             const averageRating = await ratingDAO.getAverageRatingForProduct(id);
//
//             // Convert ratings to DTOs
//             const ratingDTOs = ratings.map(rating => MapperUtils.toRatingDTO(rating));
//
//             const response = {
//                 song: {
//                     id: song._id.toString(),
//                     title: song.title
//                 },
//                 ratings: ratingDTOs,
//                 averageRating,
//                 totalRatings: ratings.length
//             };
//
//             res.status(200).json(
//                 ApiResponse.success(response, 'Song ratings retrieved successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
// }