// import { Request, Response, NextFunction } from 'express';
// import { ApiResponse } from '../../utils/ApiResponse';
// import { ApiError } from '../../utils/ApiError';
// import { UpdateRatingDTO } from '../../dto/RatingDTO';
//
// export class RatingManagementController {
//     /**
//      * @desc    Update an existing rating
//      * @route   PUT /api/ratings/:id
//      * @access  Private (rating author or admin)
//      */
//     async updateRating(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//             const ratingData: UpdateRatingDTO = req.body;
//             const userId = req.user?.id; // Assuming user info is attached to request by auth middleware
//
//             // Validate rating value if provided
//             if (ratingData.rating !== undefined && (ratingData.rating < 1 || ratingData.rating > 5)) {
//                 throw ApiError.badRequest('Rating must be between 1 and 5');
//             }
//
//             const ratingDAO = req.db?.getRatingDAO();
//             if (!ratingDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Verify rating exists
//             const existingRating = await ratingDAO.findById(id);
//             if (!existingRating) {
//                 throw ApiError.notFound('Rating not found');
//             }
//
//             // Authorize user (rating author or admin)
//             if (userId !== existingRating.author.toString() && req.user?.role !== 'admin') {
//                 throw ApiError.forbidden('Not authorized to update this rating');
//             }
//
//             const updatedRating = await ratingDAO.update(id, ratingData);
//
//             res.status(200).json(
//                 ApiResponse.success(updatedRating, 'Rating updated successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
//
//     /**
//      * @desc    Delete a rating
//      * @route   DELETE /api/ratings/:id
//      * @access  Private (rating author or admin)
//      */
//     async deleteRating(req: Request, res: Response, next: NextFunction) {
//         try {
//             const { id } = req.params;
//             const userId = req.user?.id; // Assuming user info is attached to request by auth middleware
//
//             const ratingDAO = req.db?.getRatingDAO();
//             if (!ratingDAO) {
//                 throw ApiError.internal('Database access error');
//             }
//
//             // Verify rating exists
//             const existingRating = await ratingDAO.findById(id);
//             if (!existingRating) {
//                 throw ApiError.notFound('Rating not found');
//             }
//
//             // Authorize user (rating author or admin)
//             if (userId !== existingRating.author.toString() && req.user?.role !== 'admin') {
//                 throw ApiError.forbidden('Not authorized to delete this rating');
//             }
//
//             const deleted = await ratingDAO.delete(id);
//
//             res.status(200).json(
//                 ApiResponse.success({ deleted }, 'Rating deleted successfully')
//             );
//         } catch (error) {
//             next(error);
//         }
//     }
// }