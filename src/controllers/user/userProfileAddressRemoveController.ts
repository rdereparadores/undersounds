import { Request, Response } from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userProfileAddressRemoveController = async (req: Request, res: Response): Promise<Response> => {
    try {

        const { _id } = req.body
        if (!_id) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }
        const userDAO = req.db!.createBaseUserDAO()
        const user = await userDAO.findByUid(req.uid!)
        await userDAO.removeAddress(user!, { _id })

        return res.json({
            data: {
                message: 'OK'
            }
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
