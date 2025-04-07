import express, { NextFunction, Request, request, Response, response } from 'express'
import 'dotenv/config'
import { authTokenController } from '../controlers/auth/authTokenController'
import { authSignUpController } from '../controlers/auth/authSignUpController'
import { authSignInController } from '../controlers/auth/authSignInController'

export const authRouter = express.Router()

authRouter.post('signup', authSignUpController)
authRouter.post('signin', authSignInController)
authRouter.post('token', authTokenController)