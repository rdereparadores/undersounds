import express from 'express'
import Stripe from 'stripe'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import { OrderDTO } from '../../dto/OrderDTO'

interface CartItemProps {
    id: string,
    format: 'cd' | 'vinyl' | 'digital' | 'cassette',
    quantity: number
}

export const checkoutCreate = async (req: express.Request, res: express.Response) => {
    const { cart } = req.body
    try {
        if (!cart || cart.length == 0) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }
        const userDAO = req.db!.createBaseUserDAO()
        const orderDAO = req.db!.createOrderDAO()
        const productDAO = req.db!.createProductDAO()

        const lineItems = await Promise.all(cart.map(async (item: CartItemProps) => {
            const product = await productDAO.findById(item.id)
            if (!product) throw new Error()
            return {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: product.title,
                    },
                    unit_amount: product.pricing[item.format] * 100,
                },
                quantity: item.quantity,
            }
        }))
        const lines = await Promise.all(cart.map(async (item: CartItemProps) => {
            const product = await productDAO.findById(item.id)
            if (!product) throw new Error()
            return {
                quantity: item.quantity,
                format: item.format,
                product: product._id!,
                price: product.pricing[item.format]
            }
        }))

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
        try {
            const session = await stripe.checkout.sessions.create({
                success_url: `http://${process.env.APP_URL}:${process.env.PORT}/shop/checkout/success?checkoutSession={CHECKOUT_SESSION_ID}`,
                cancel_url: `http://${process.env.APP_URL}:${process.env.PORT}/shop/checkout/fail?checkoutSession={CHECKOUT_SESSION_ID}`,
                line_items: lineItems,
                mode: 'payment',
                payment_method_types: ['card']
            })

            const order = new OrderDTO({
                stripeCheckoutId: session!.id,
                purchaseDate: new Date(),
                paid: false,
                user: (await userDAO.findByUid(req.uid!))!._id!,
                lines
            })

            await orderDAO.create(order)

            res.json({
                data: {
                    url: session.url!
                }
            })
        } catch (err) {
            res.status(400).send({ msg: 'ERR_CREATING_ORDER' })
        }
    } catch {
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
}