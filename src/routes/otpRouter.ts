import express from 'express'
import { otpCreateController } from '../controllers/otp/otpCreateController'

export const otpRouter = express.Router()

otpRouter.get('/create', otpCreateController)