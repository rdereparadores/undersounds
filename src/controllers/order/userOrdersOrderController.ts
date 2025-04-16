import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userOrdersOrderController = async (req: express.Request, res: express.Response) => {
    try {
        const { orderId } = req.body

        const userDAO = req.db!.createBaseUserDAO()
        const orderDAO = req.db!.createOrderDAO()
        const order = await orderDAO.findById(orderId)
        const user = await userDAO.findByUid(req.uid!)

        if (!order) {
            return res.status(Number(apiErrorCodes[3001].httpCode)).json({
                error: {
                    code: 3001,
                    message: apiErrorCodes[3001].message
                }
            })
        }

        if (order.user !== user!._id) {
            return res.status(Number(apiErrorCodes[1003].httpCode)).json({
                error: {
                    code: 1003,
                    message: apiErrorCodes[1003].message
                }
            })
        }

        res.json({
            data: order
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