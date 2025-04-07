import express from 'express'

const authRouter = express.Router()

authRouter.post('signup', authSignUpController)
authRouter.post('signin', authSignInController)
authRouter.post('token', authTokenController)