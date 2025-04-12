import { Request, Response } from 'express'
import { AddressDTO } from '../../dto/BaseUserDTO'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userProfileAddressAddController = async (req: Request, res: Response): Promise<Response> => {
    try {

        const { address } = req.body
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

        const newAddress: AddressDTO = {
            alias: address.alias,
            name: address.name,
            sur_name: address.surname,
            phone: address.phone,
            address: address.address,
            address_2: address.address2,
            province: address.province,
            city: address.city,
            zip_code: address.zipCode,
            country: address.country,
            observations: address.observations,
            default: false
        }

        await userDAO.addAddress(user!, newAddress)

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
