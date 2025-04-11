import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

export const userProfileAddressController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { uid } = req.body;

        const factory = new MongoDBDAOFactory()
        const userDAO = factory.createBaseUserDAO()
        const user = await userDAO.findByUid(uid!)
        const addresses = await userDAO.getAddresses(user!)

        return res.status(200).json({
            data: addresses
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'USER_ADDRESS_FETCH_ERROR'
        });
    }
};
