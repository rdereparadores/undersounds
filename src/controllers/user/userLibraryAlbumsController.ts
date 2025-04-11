import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

export const userLibraryAlbumsController = async (req: Request, res: Response): Promise<Response> => {
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

        const productDAO = factory.createProductDAO();
        const products = await Promise.all(
            user.library.map((prodId: any) => productDAO.findById(prodId.toString()))
        );

        const albums = products.filter(product => product !== null && product?.product_type === 'album');

        return res.status(200).json({
            success: true,
            msg: 'Library albums retrieved successfully',
            data: albums
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'USER_LIBRARY_ALBUMS_FETCH_ERROR'
        });
    }
};
