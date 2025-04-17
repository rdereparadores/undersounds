import express from 'express'
import { checkoutCreate } from '../controllers/checkout/checkoutCreate'
import { checkoutSuccess } from '../controllers/checkout/checkoutSuccess'

export const checkoutRouter = express.Router()

checkoutRouter.post('/order/create', checkoutCreate)
checkoutRouter.get('/order/success', checkoutSuccess)