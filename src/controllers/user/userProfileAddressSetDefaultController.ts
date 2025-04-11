import { Request, Response } from 'express'

export const userProfileAddressSetDefaultController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { uid, addressId } = req.body;

        if (!addressId || typeof addressId !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'AddressID is required',
                    code: 'ADDRESS_ID_REQUIRED'
                }
            });
        }
        const baseUserDAO = req.db!.createBaseUserDAO()
        const user = await baseUserDAO.findByUid(uid)

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'User not found',
                    code: 'USER_NOT_FOUND'
                }
            });
        }

        const addressExists = user.addresses.some(address => address._id === addressId)
        if (!addressExists) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Address not found in this user',
                    code: 'ADDRESS_NOT_FOUND'
                }
            });
        }

        const setDefault = await baseUserDAO.setAddressAsDefault(user, { _id: addressId })

        return res.status(200).json({
            data: {
                message: 'OK'
            }
        });
    } catch {
        return res.status(500).json({
            error: `USER_ADDRESS_SET_DEFAULT_ERROR`
        });
    }
};
