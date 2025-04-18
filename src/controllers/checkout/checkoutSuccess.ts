import express from 'express'
import Stripe from 'stripe'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

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
    const orderDAO = req.db!.createOrderDAO()
    const order = await orderDAO.findByStripeCheckoutId(sessionId)
    if (!order) throw new Error()

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)
        if (session.payment_status == 'paid') {
            await orderDAO.markAsPaid(order)
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