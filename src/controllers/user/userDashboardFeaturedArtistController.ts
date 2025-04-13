import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

/**
 * @desc    Gets randomly recommended artists that the user doesn't follow
 * @route   GET /dashboard/featured/artists
 * @access  Private
 */

export const recommendedArtistsController = async (req: Request, res: Response): Promise<Response> => {
    try {

        const { id } = req.query;
        if (!id || typeof id !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'UserID is required',
                    code: 'USER_ID_REQUIRED'
                }
            });
        }

        const factory = new MongoDBDAOFactory();
        const userDAO = factory.createUserDAO();
        const artistDAO = factory.createArtistDAO();

        const user = await userDAO.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'User not found',
                    code: 'USER_NOT_FOUND'
                }
            });
        }

        const allArtists = await artistDAO.getAll();

        const shuffledArtists = [...allArtists].sort(() => Math.random() - 0.5);

        interface RecommendedArtist {
            artist_name: string;
            artist_img_url?: string;
            artist_user_name: string;
        }

        const recommended: RecommendedArtist[] = [];
        for (const artist of shuffledArtists) {
            if (recommended.length >= 6) break;

            const isFollowing = await userDAO.isFollowing(user, artist);
            if (!isFollowing) {
                recommended.push({
                    artist_name: artist.artist_name,
                    artist_img_url: artist.artist_img_url,
                    artist_user_name: artist.artist_user_name,
                });
            }
        }
        return res.status(200).json({
            success: true,
            data: recommended
        });
    } catch (error){
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return res.status(500).json({
            success: false,
            error:{
                code:'FEATURED_ARTIST_FETCH_ERROR',
                message: errorMessage
            }
        });
    }
};
