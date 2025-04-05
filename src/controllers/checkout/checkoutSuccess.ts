import express from 'express'
import Stripe from 'stripe'

export const checkoutSuccess = async (req: express.Request, res: express.Response) => {
    if (!req.body.sessionId) {
        res.status(200).send({ err: 'NO_SESSION_ID_PROVIDED' })
        return
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
    const sessionId: string = req.body.sessionId

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)
        if (session.payment_status == 'paid') {
            // Buscar pedido asociado a ese ID, marcar como pagado
            res.send({msg: 'ORDER_PAID'})
        } else {
            // Devolver error
            res.send({msg: 'ORDER_NOT_PAID'})
        }
    } catch (err) {
        res.status(400).send({msg: 'SESSION_ID_NOT_FOUND'})
    }
}