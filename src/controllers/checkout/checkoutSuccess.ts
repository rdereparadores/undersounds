import express from 'express'
import Stripe from 'stripe'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import { transporter } from '../../utils/mailSending'
import { newOrder } from '../../utils/mailTemplates/newOrder'

export const checkoutSuccess = async (req: express.Request, res: express.Response) => {
    const { sessionId } = req.body
    if (!sessionId) {
        return res.status(Number(apiErrorCodes[3000].httpCode)).json({
            error: {
                code: 3000,
                message: apiErrorCodes[3000].message
            }
        })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
    const productDAO = req.db!.createProductDAO()
    const orderDAO = req.db!.createOrderDAO()
    const userDAO = req.db!.createBaseUserDAO()
    const order = await orderDAO.findByStripeCheckoutId(sessionId)
    if (!order) throw new Error()

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)
        if (session.payment_status == 'paid') {
            if (!order.paid) {
                const user = await userDAO.findById(order.user)
                let shippingCost = order.lines.some(l => l.format !== 'digital') ? 4.99 : 0
                const lines = await Promise.all(order.lines.map(async (line) => {
                    const product = await productDAO.findById(line.product)
                    return {
                        title: product!.title,
                        format: line.format,
                        quantity: line.quantity,
                        price: line.price
                    }
                }))
                transporter.sendMail({
                    from: '"Soporte Undersounds" <soporteundersounds@gmail.com>',
                    to: user!.email,
                    subject: `Resumen de tu pedido ${order._id!}`,
                    html: newOrder(order._id!, user!.name, new Date(order.purchaseDate), lines, shippingCost)
                })

                await orderDAO.markAsPaid(order)
                await Promise.all(order.lines.map(async (line) => {
                    if (line.format === 'digital') {
                        await userDAO.addToLibrary({ _id: order.user }, { _id: line.product })
                    }
                }))
            }
            res.json({
                data: { paid: true }
            })
        } else {
            res.json({
                data: { paid: false }
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
}