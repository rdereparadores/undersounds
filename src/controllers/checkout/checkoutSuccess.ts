import express from 'express'
import Stripe from 'stripe'

export const checkoutSuccess = async (req: express.Request, res: express.Response) => {
    if (!req.body.sessionId) {
        res.status(200).send({err: 'INVALID_SESSION_ID'})
        return
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
    const sessionId: string = req.body.sessionId

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status == 'paid') {
        // Buscar pedido asociado a ese ID, marcar como pagado
    } else {
        // Devolver error
    }
}