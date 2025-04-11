import express, { NextFunction, Request, request, Response, response } from 'express'
import 'dotenv/config'
import { authSignUpController } from '../controllers/auth/authSignUpController'
import { authSignInController } from '../controllers/auth/authSignInController'
import { authTokenMiddleware } from '../middleware/authTokenMiddleware'
import { authSignUpGoogleController } from '../controllers/auth/authSignUpGoogleController'

export const authRouter = express.Router()

authRouter.post('/signup', authSignUpController)
authRouter.post('/signupgoogle', authSignUpGoogleController)
authRouter.post('/signin',authTokenMiddleware, authSignInController)
//authRouter.post('token', authTokenController)