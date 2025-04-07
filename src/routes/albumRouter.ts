import express from 'express'

export const albumRouter = express.Router()

albumRouter.get('info', albumInfoController)
albumRouter.get('ratings', albumRatingsController)