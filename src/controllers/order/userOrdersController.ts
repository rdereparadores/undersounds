import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userOrdersController = async (req: express.Request, res: express.Response) => {
    try {
        const userDAO = req.db!.createBaseUserDAO()
        const user = await userDAO.findByUid(req.uid!)

        const orderDAO = req.db!.createOrderDAO()
        const orders = await orderDAO.findOrdersFromUser(user!)

        res.json({
            data: orders
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