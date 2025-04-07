import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

/**
 * @desc    Get detailed information of a specific order
 * @route   GET /api/user/order/order
 * @access  Private
 */
export const userOrdersOrderController = async (req: Request, res: Response) => {
    try {
        const { orderId, userId } = req.query;

        if (!orderId || typeof orderId !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Order ID is required',
                    code: 'ORDER_ID_REQUIRED'
                }
            });
        }

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'User ID is required',
                    code: 'USER_ID_REQUIRED'
                }
            });
        }

        const factory = new MongoDBDAOFactory();
        const orderDAO = factory.createOrderDAO();
        const order = await orderDAO.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Order not found',
                    code: 'ORDER_NOT_FOUND'
                }
            });
        }

        if (order.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                error: {
                    message: 'The order does not belong to the user',
                    code: 'NOT_AUTHORIZED'
                }
            });
        }

        res.status(200).json({
            success: true,
            msg: 'Order details retrieved successfully',
            data: order
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        res.status(500).json({
            success: false,
            error: {
                message: errorMessage,
                code: 'ORDER_FETCH_ERROR'
            }
        });
    }
};