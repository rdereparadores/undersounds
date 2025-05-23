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
    const { cart, addressId } = req.body
    try {
        if (!cart || cart.length == 0 || !addressId) {
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
        const user = await userDAO.findByUid(req.uid!)

        let stripeLineItems: any[] = []
        let lines: any[] = []

        await Promise.all(cart.map(async (item: CartItemProps) => {
            const product = await productDAO.findById(item.id)
            if (!product) throw new Error()
            stripeLineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: product.title,
                        metadata: {
                            "Formato": item.format
                        }
                    },
                    unit_amount: product.pricing[item.format] * 100,
                },
                quantity: item.quantity,
            })
            lines.push({
                quantity: item.quantity,
                format: item.format,
                product: product._id!,
                price: product.pricing[item.format]
            })
        }))

        if (lines.findIndex(item => item.format != 'digital') != -1) {
            stripeLineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: 'Gastos de envío'
                    },
                    unit_amount: 499,
                },
                quantity: 1,
            })
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
        const session = await stripe.checkout.sessions.create({
            success_url: `http://${process.env.APP_URL}:${process.env.PORT}/shop/checkout/success/{CHECKOUT_SESSION_ID}`,
            cancel_url: `http://${process.env.APP_URL}:${process.env.PORT}/shop/checkout/deny/`,
            line_items: stripeLineItems,
            mode: 'payment',
            payment_method_types: ['card']
        })

        const address = user!.addresses.find(address => address._id! == addressId)

        const order = new OrderDTO({
            stripeCheckoutId: session!.id,
            purchaseDate: new Date(),
            paid: false,
            user: user!._id!,
            address: {
                ...address!,
                zipCode: address!.zipCode.toString()
            },
            lines
        })

        await orderDAO.create(order)

        res.json({
            data: {
                url: session.url!
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