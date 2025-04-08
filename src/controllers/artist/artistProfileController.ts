import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

export const artistProfileController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.query;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'ArtistID is required',
                    code: 'ARTIST_ID_REQUIRED'
                }
            });
        }

        const factory = new MongoDBDAOFactory();
        const artistDAO = factory.createArtistDAO();
        const artist = await artistDAO.findById(id);

        if (!artist) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Artist not found',
                    code: 'ARTIST_NOT_FOUND'
                }
            });
        }

        return res.status(200).json({
            success: true,
            msg: 'Artist info retrieved successfully',
            data: artist
        });
    } catch (_error) {
        return res.status(500).json({
            err: 'ARTIST_PROFILE_FETCH_ERROR'
        });
    }
};
