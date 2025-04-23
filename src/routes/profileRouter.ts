import express from 'express'
import { profileArtistInfoController } from '../controllers/profile/profileArtistInfoController'

export const profileRouter = express.Router()

profileRouter.post('/artist/info', profileArtistInfoController)