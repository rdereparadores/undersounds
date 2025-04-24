import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const productRatingsUserController = async (req: express.Request, res: express.Response) => {
    const { id } = req.body
    try {
        if (!id) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }

        const orderDAO = req.db!.createOrderDAO()
        const userDAO = req.db!.createBaseUserDAO()
        const productDAO = req.db!.createProductDAO()
        const user = await userDAO.findByUid(req.uid!)
        const product = await productDAO.findById(id)

        if (!product) {
            return res.status(Number(apiErrorCodes[3001].httpCode)).json({
                error: {
                    code: 3001,
                    message: apiErrorCodes[3001].message
                }
            })
        }

        const orders = await orderDAO.findOrdersFromUser(user!)
        const rateable = orders.findIndex(o => o.lines.findIndex(l => l.product == id) !== -1) !== -1
        const ratings = await productDAO.getRatings(product)

        return res.json({
            data: {
                rating: ratings.find(r => r.author == user!._id),
                rateable 
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
}