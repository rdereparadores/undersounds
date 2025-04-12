import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userProfileAddressSetDefaultController = async (req: express.Request, res: express.Response): Promise<express.Response> => {
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

        const baseUserDAO = req.db!.createBaseUserDAO()
        const user = await baseUserDAO.findByUid(req.uid!)

        await baseUserDAO.setAddressAsDefault(user!, { _id })

        return res.status(200).json({
            data: {
                message: 'OK'
            }
        })
    } catch {
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
};
