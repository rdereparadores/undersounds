import express from 'express'
import { AddressDTO } from '../../dto/BaseUserDTO'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userProfileAddressAddController = async (req: express.Request, res: express.Response) => {
    const { address } = req.body
    try {
        if (!address) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }

        const userDAO = req.db!.createBaseUserDAO()
        const user = await userDAO.findByUid(req.uid!)

        const newAddress: AddressDTO = address

        const result = await userDAO.addAddress(user!, newAddress)
        if (!result) throw new Error()

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
