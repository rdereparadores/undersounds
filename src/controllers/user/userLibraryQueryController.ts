import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

/**
 * @desc    Search in the user's library
 * @route   GET /api/user/library/search
 * @access  Private
 */
export const librarySearchController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { searchTerm } = req.body;
        const { id } = req.query;

        if (!id) {
            return res.status(401).json({
                success: false,
                error: 'USER_NOT_AUTHENTICATED'
            });
        }

        if (!searchTerm || typeof searchTerm !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'SEARCH_TERM_REQUIRED'
            });
        }

        const factory = new MongoDBDAOFactory();
        const userDAO = factory.createUserDAO();
        const productDAO = factory.createProductDAO();
        const user = await userDAO.findById(id.toString());

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'User not found',
                    code: 'USER_NOT_FOUND'
                }
            });
        }

        const products = await productDAO.searchInLibrary(
            user.library.map(id => id.toString()),
            searchTerm
        );

        return res.json({
            success: true,
            data: { products }
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return res.status(500).json({
            success: false,
            error:{
                code:'SEARCH_LIBRARY_FETCH_ERROR',
                message: errorMessage
            }
        });
    }
};
