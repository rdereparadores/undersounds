import express, { NextFunction, Request, request, Response, response } from 'express'
import 'dotenv/config'
import { authSignUpController } from '../controllers/auth/authSignUpController'
import { authSignInController } from '../controllers/auth/authSignInController'

export const authRouter = express.Router()

authRouter.post('/signup', authSignUpController)
authRouter.post('/signin', authSignInController)
//authRouter.post('token', authTokenController)