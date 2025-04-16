import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userProfileAddressRemoveController = async (req: express.Request, res: express.Response) => {
    const { addressId } = req.body
    try {
        if (!addressId) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }
        const userDAO = req.db!.createBaseUserDAO()
        const user = await userDAO.findByUid(req.uid!)
        const result = await userDAO.removeAddress(user!, { _id: addressId })
        if (!result) throw new Error()

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
