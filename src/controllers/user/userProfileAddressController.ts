import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

export const userProfileController = async (req: Request, res: Response): Promise<Response> => {
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

        return res.status(200).json({
            success: true,
            msg: 'User addresses retrieved successfully',
            data: user.addresses
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'USER_ADDRESS_FETCH_ERROR'
        });
    }
};
