import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';

export class AlbumInfoController {
    /**
     * @desc    Get album information including title, artists, tracklist
     * @route   GET /api/album/info
     * @access  Public
     */
    async getAlbumInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.query;

            if (!id || typeof id !== 'string') {
                throw ApiError.badRequest('Album ID is required');
            }

            const albumDAO = req.db?.getAlbumDAO();
            if (!albumDAO) {
                throw ApiError.internal('Database access error');
            }

            const album = await albumDAO.findById(id);

            if (!album) {
                throw ApiError.notFound('Album not found');
            }

            // Ensure tracklist and artist info is populated
            const populatedAlbum = await albumDAO.findByIdWithDetails(id);

            res.status(200).json(
                ApiResponse.success(populatedAlbum, 'Album information retrieved successfully')
            );
        } catch (error) {
            next(error);
        }
    }
}