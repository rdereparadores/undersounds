import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

export const artistProfileUpdateController = async (req: Request, res: Response): Promise<Response> => {
    try {

        const { id, newArtist } = req.body;

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

        const updatedArtist = await artistDAO.update(newArtist);
        if (!updatedArtist) {
            return res.status(500).json({
                success: false,
                error: {
                    message: 'Could not update artist',
                    code: 'ARTIST_UPDATE_ERROR'
                }
            });
        }

        return res.status(200).json({
            success: true,
            msg: 'Artist profile updated successfully',
            data: updatedArtist
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
};
