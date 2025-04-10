import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';
import { AddressDTO } from '../../dto/BaseUserDTO';

// CORREGIDO Y REVISADO
export const userProfileAddressAddController = async (req: Request, res: Response): Promise<Response> => {
    try {

        const { uid, address } = req.body
        if (!address) {
            return res.status(400).json({
                error: {
                    message: 'Address is required',
                    code: 1000
                }
            });
        }

        const factory = new MongoDBDAOFactory()
        const userDAO = factory.createBaseUserDAO()
        const user = await userDAO.findByUid(uid)

        const newAddress: AddressDTO = {
            alias: address.alias,
            name: address.name,
            sur_name: address.surName,
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

        const updatedUser = await userDAO.addAddress(user!, newAddress)

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
