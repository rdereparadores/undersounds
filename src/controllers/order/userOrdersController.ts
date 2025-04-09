import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

/**
 * @desc    Get all orders for a user
 * @route   GET /api/user/orders
 * @access  Private
 */
export const userOrdersController = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'User ID is required',
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

        const orderDAO = factory.createOrderDAO();
        const orders = await orderDAO.getOrdersFromUser(user);

        res.status(200).json({
            success: true,
            msg: 'Orders retrieved successfully',
            data: orders || []
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        res.status(500).json({
            success: false,
            error: {
                message: errorMessage,
                code: 'ORDERS_FETCH_ERROR'
            }
        });
    }
};