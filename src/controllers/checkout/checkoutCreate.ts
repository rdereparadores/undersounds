import express from 'express'
import Stripe from 'stripe'

interface CartItemProps {
    id: string,
    type: string,
    format: string,
    quantity: number
}

export const checkoutCreate = async (req: express.Request, res: express.Response) => {
    if (!req.body.cart) {
        res.status(200).send({err: 'INVALID_CART'})
        return 
    }

    // TODO Buscar elementos del carrito en BD y crear array de líneas de pedido
    const lineItems = req.body.cart.map((item: CartItemProps) => (
        {
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.id,
                },
                unit_amount: 6.99,
            },
            quantity: item.quantity,
        }
    ))

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
    const session = await stripe.checkout.sessions.create({
        success_url: `http://${process.env.APP_URL}:${process.env.PORT}/shop/checkout/success?checkoutSession={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://${process.env.APP_URL}:${process.env.PORT}/shop/checkout/fail?checkoutSession={CHECKOUT_SESSION_ID}`,
        line_items: lineItems,
        mode: 'payment'
    })
    // TODO Crear pedido en BD pendiente de pago, incluir sessionID

    res.send(session)
    // res.redirect(303, session.url);
}