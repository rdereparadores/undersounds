import { Request, Response } from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userProfileAddressController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userDAO = req.db!.createBaseUserDAO()
        const user = await userDAO.findByUid(req.uid!)
        const addresses = await userDAO.getAddresses(user!)

        return res.json({
            data: addresses
        })
    } catch (error) {
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
};
