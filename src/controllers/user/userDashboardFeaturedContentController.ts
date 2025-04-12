import express, { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';
import { ProductDTO } from "../../dto/ProductDTO";

/**
 * @desc    Retrieves the latest products released by artists followed by the user.
 * @route   GET /api/user/dashboard/featured/content
 * @access  Public
 */

export const userDashboardContentController = async (req: express.Request, res: express.Response) => {
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
        const artistDAO = factory.createArtistDAO();
        const allProducts = await productDAO.getAll();
        const filteredProducts: ProductDTO[] = [];

        for (const product of allProducts) {
            const artist = await artistDAO.findByArtistUsername(product.author);
            const isFollowing = await userDAO.isFollowing(user, artist);

            if(isFollowing) {
                filteredProducts.push(product);
            }
        }

        const sortedProducts = filteredProducts.sort((a, b) =>
            b.release_date.getTime() - a.release_date.getTime()
        );

        const lastedProducts = sortedProducts.slice(0, 10);
        return res.status(200).json({
            success: true,
            data:{
                lastedProducts
            }
        })

    }catch (error){
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return res.status(500).json({
            success: false,
            error:{
                code:'FEATURED_CONTENT_FETCH_ERROR',
                message: errorMessage
            }
        });
    }
}