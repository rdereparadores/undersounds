import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';


export const artistProfileInfoController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.query;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Artist ID is required',
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
            msg: 'Artist information retrieved successfully',
            data: artist.toJson()
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return res.status(500).json({
            success: false,
            error: {
                message: errorMessage,
                code: 'ARTIST_FETCH_ERROR'
            }
        });
    }
};
