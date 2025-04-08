import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

export const userIsFollowingController = async (req: Request, res: Response) => {
    try {
        const { userId, artistId } = req.query;

        if ((!userId || typeof userId !== 'string')) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'UserID is required',
                    code: 'USER_ID_REQUIRED'
                }
            });
        }

        if ((!artistId || typeof artistId !== 'string')) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'artistID is required',
                    code: 'ARTIST_ID_REQUIRED'
                }
            });
        }

        const factory = new MongoDBDAOFactory();

        const userDAO = factory.createUserDAO();
        const user = await userDAO.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'User not found',
                    code: 'USER_NOT_FOUND'
                }
            });
        }

        const artistDAO = factory.createArtistDAO();
        const artist = await  artistDAO.findById(artistId);

        if (!artist) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Artist not found',
                    code: 'ARTIST_NOT_FOUND'
                }
            });
        }

        const isFollowing = await artistDAO.findById(userId);
        if(isFollowing){
            res.status(200).json({
                success: true,
                message: 'Following retrieved successfully',
                data: { isFollowing }
            });
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        res.status(500).json({
            success: false,
            error: {
                message: errorMessage,
                code: 'FOLLOW_FETCH_ERROR'
            }
        });
    }
};