import express from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

export const userProfileController = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.query
        if ((!id || typeof id !== 'string')) {
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
            msg: 'User info retrieved successfully',
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            err: 'USER_PROFILE_FETCH_ERROR'
        });
    }
};
