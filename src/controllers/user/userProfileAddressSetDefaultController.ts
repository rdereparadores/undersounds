import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userProfileAddressSetDefaultController = async (req: express.Request, res: express.Response) => {
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
        const baseUserDAO = req.db!.createBaseUserDAO()
        const user = await baseUserDAO.findByUid(req.uid!)

        const addressExists = user!.addresses.some(address => address._id == addressId)
        if (!addressExists) {
            return res.status(Number(apiErrorCodes[3001].httpCode)).json({
                error: {
                    code: 3001,
                    message: apiErrorCodes[3001].message
                }
            })
        }

        const setDefault = await baseUserDAO.setAddressAsDefault(user!, { _id: addressId })
        if (!setDefault) throw new Error()

        return res.json({
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
