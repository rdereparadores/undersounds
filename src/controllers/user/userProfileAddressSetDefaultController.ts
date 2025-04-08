import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

export const userProfileAddressSetDefaultController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id, addressId } = req.body;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'UserID is required',
                    code: 'USER_ID_REQUIRED'
                }
            });
        }
        if (!addressId || typeof addressId !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'AddressID is required',
                    code: 'ADDRESS_ID_REQUIRED'
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

        const addressExists = user.addresses.some(address => address._id === addressId);
        if (!addressExists) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Address not found in this user',
                    code: 'ADDRESS_NOT_FOUND'
                }
            });
        }

        user.addresses = user.addresses.map(address => ({
            ...address,
            default: address._id === addressId
        }));

        const updatedUser = await userDAO.update(user);
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
            msg: 'User address set as default successfully',
            data: updatedUser.addresses
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({
            success: false,
            error: `USER_ADDRESS_SET_DEFAULT_ERROR: ${errorMessage}`
        });
    }
};
