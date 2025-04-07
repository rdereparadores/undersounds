import express from 'express'

export const songRouter = express.Router()

songRouter.get('info', songInfoController)
songRouter.get('ratings', songRatingsController)