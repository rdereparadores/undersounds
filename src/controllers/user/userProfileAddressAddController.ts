import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

export const userProfileAddressAddController = async (req: Request, res: Response): Promise<Response> => {
    try {

        const { id, address } = req.body;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'UserID is required',
                    code: 'USER_ID_REQUIRED'
                }
            });
        }
        if (!address) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Address is required',
                    code: 'ADDRESS_REQUIRED'
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

        const updatedUser = await userDAO.addAddress(user, address);
        if (!updatedUser) {
            return res.status(500).json({
                success: false,
                error: {
                    message: 'Could not update user',
                    code: 'USER_UPDATE_ERROR'
                }
            });
        }

        return res.status(200).json({
            success: true,
            msg: 'User address added successfully',
            data: updatedUser.addresses
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({
            success: false,
            error: `USER_ADDRESS_ADD_ERROR: ${errorMessage}`
        });
    }
};
