import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { MapperUtils } from '../../utils/MapperUtils';

export class SongInfoController {
    /**
     * @desc    Get song information including title, artists, prices, recommendations
     * @route   GET /api/songs/info
     * @access  Public
     */
    async getSongInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.query;

            if (!id || typeof id !== 'string') {
                throw ApiError.badRequest('Song ID is required');
            }

            const songDAO = req.db?.getSongDAO();
            if (!songDAO) {
                throw ApiError.internal('Database access error');
            }

            const song = await songDAO.findById(id);

            if (!song) {
                throw ApiError.notFound('Song not found');
            }

            // Incrementar contador de reproducciones
            await songDAO.incrementPlays(id);

            // Obtener detalles completos de la canción con relaciones populadas
            const songWithDetails = await songDAO.findByIdWithDetails(id);

            // Get recommendations based on this song
            const recommendationsList = await songDAO.findRecommendations(id, 5); // Get 5 recommendations
            const recommendations = recommendationsList.map(rec => MapperUtils.toSongDTO(rec));

            // Convert to DTO for response
            const songDTO = MapperUtils.toSongDTO(songWithDetails!);

            // Construct response object with all the required info
            const response = {
                song: songDTO,
                recommendations
            };

            res.status(200).json(
                ApiResponse.success(response, 'Song information retrieved successfully')
            );
        } catch (error) {
            next(error);
        }
    }
}