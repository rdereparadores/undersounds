import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

/**
 * @desc    Get album information including title, artists, tracklist
 * @route   GET /api/album/info
 * @access  Public
 */
export const getAlbumInfo = async (req: Request, res: Response) => {
    try {
        const { id } = req.query;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Album ID is required',
                    code: 'ALBUM_ID_REQUIRED'
                }
            });
        }

        const factory = new MongoDBDAOFactory();
        const albumDAO = factory.createAlbumDAO();

        const album = await albumDAO.findById(id);
        if (!album) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Album not found',
                    code: 'ALBUM_NOT_FOUND'
                }
            });
        }

        const populatedAlbum = await albumDAO.findByIdWithDetails(id);

        res.status(200).json({
            success: true,
            msg: 'Album information retrieved successfully',
            data: populatedAlbum
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        res.status(500).json({
            success: false,
            error: {
                message: errorMessage,
                code: 'ALBUM_FETCH_ERROR'
            }
        });
    }
};