import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userOrdersController = async (req: express.Request, res: express.Response) => {
    try {
        const userDAO = req.db!.createBaseUserDAO()
        const artistDAO = req.db!.createArtistDAO()
        const productDAO = req.db!.createProductDAO()
        const orderDAO = req.db!.createOrderDAO()

        const user = await userDAO.findByUid(req.uid!)
        const orders = await orderDAO.findOrdersFromUser(user!)

        const ordersPopulated = await Promise.all(orders.map(async (order) => {
            const products = await Promise.all(order.lines.map(async (line) => {
                const product = await productDAO.findById(line.product)
                const artist = await artistDAO.findById(product!.author)
                if (!product || !artist) throw new Error()
                return {
                    imgUrl: product.imgUrl,
                    title: product.title,
                    author: artist.artistName,
                    type: product.productType,
                    format: line.format,
                    price: line.price,
                    quantity: line.quantity
                }
            }))
            let totalPrice = products.reduce((sum, item) => item.price * item.quantity + sum, 0)
            totalPrice += (products.findIndex(item => item.format !== 'digital') !== -1) ? 4.99 : 0
            return {
                _id: order._id!,
                paid: order.paid,
                purchaseDate: order.purchaseDate,
                totalPrice: totalPrice.toFixed(2),
                products,
                address: order.address
            }
        }))

        res.json({
            data: ordersPopulated.sort((a, b) => {
                const dateA = new Date(a.purchaseDate)
                const dateB = new Date(b.purchaseDate)
                return dateB.getTime() - dateA.getTime()
            })
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