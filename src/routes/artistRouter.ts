import express from 'express'
import { artistProfileController } from '../controllers/artist/artistProfileController'
import { artistProfileUpdateController } from '../controllers/artist/artistProfileUpdateController'

export const artistRouter = express.Router()

artistRouter.get('/profile', artistProfileController)
artistRouter.post('/profile/update', artistProfileUpdateController)