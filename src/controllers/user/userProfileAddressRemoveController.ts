import { Request, Response } from 'express'
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory'

export const userProfileAddressRemoveController = async (req: Request, res: Response): Promise<Response> => {
    try {

        const { uid, _id } = req.body
        if (!_id) {
            return res.status(400).json({
                error: {
                    message: 'Address ID is required',
                    code: 1000
                }
            });
        }

        const factory = new MongoDBDAOFactory()
        const userDAO = factory.createBaseUserDAO()
        const user = await userDAO.findByUid(uid)
        const updatedUser = await userDAO.removeAddress(user!, { _id })

        if (updatedUser === null) {
            return res.status(500).json({
                error: {
                    message: 'Could not update user',
                    code: 1000
                }
            });
        }

        return res.status(200).json({
            data: {
                message: 'OK'
            }
        })

    } catch (error) {
        return res.status(500).json({
            error: {
                message: 'Could not update user address',
                code: 1000
            }
        });
    }
};
