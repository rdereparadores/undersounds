import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { ApiError } from '../../../utils/ApiError';
import { MapperUtils } from '../../utils/MapperUtils';

export class RatingManagementController {
    /**
     * @desc    Update an existing rating
     * @route   PUT /api/ratings/:id
     * @access  Private (rating author or admin)
     */
    async updateRating(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const ratingData = req.body;

            // Para simplificar el ejercicio, no implementamos autenticación
            // pero en un caso real deberíamos validar que el usuario actual
            // es el autor del rating o es un administrador
            // const userId = req.user?.id;

            // Validate rating value if provided
            if (ratingData.rating !== undefined && (ratingData.rating < 1 || ratingData.rating > 5)) {
                throw ApiError.badRequest('Rating must be between 1 and 5');
            }

            const ratingDAO = req.db?.getRatingDAO();
            if (!ratingDAO) {
                throw ApiError.internal('Database access error');
            }

            // Verify rating exists
            const existingRating = await ratingDAO.findById(id);
            if (!existingRating) {
                throw ApiError.notFound('Rating not found');
            }

            // Authorize user (rating author or admin)
            // if (userId !== existingRating.author.toString() && req.user?.role !== 'admin') {
            //     throw ApiError.forbidden('Not authorized to update this rating');
            // }

            const updatedRating = await ratingDAO.update(id, ratingData);
            if (!updatedRating) {
                throw ApiError.notFound('Rating not found after update attempt');
            }

            // Convert to DTO for response
            const ratingDTO = MapperUtils.toRatingDTO(updatedRating);

            res.status(200).json(
                ApiResponse.success(ratingDTO, 'Rating updated successfully')
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Delete a rating
     * @route   DELETE /api/ratings/:id
     * @access  Private (rating author or admin)
     */
    async deleteRating(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            // Para simplificar el ejercicio, no implementamos autenticación
            // pero en un caso real deberíamos validar que el usuario actual
            // es el autor del rating o es un administrador
            // const userId = req.user?.id;

            const ratingDAO = req.db?.getRatingDAO();
            if (!ratingDAO) {
                throw ApiError.internal('Database access error');
            }

            // Verify rating exists
            const existingRating = await ratingDAO.findById(id);
            if (!existingRating) {
                throw ApiError.notFound('Rating not found');
            }

            // Authorize user (rating author or admin)
            // if (userId !== existingRating.author.toString() && req.user?.role !== 'admin') {
            //     throw ApiError.forbidden('Not authorized to delete this rating');
            // }

            const deleted = await ratingDAO.delete(id);

            res.status(200).json(
                ApiResponse.success({ deleted }, 'Rating deleted successfully')
            );
        } catch (error) {
            next(error);
        }
    }
}