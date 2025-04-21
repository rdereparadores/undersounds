import express from 'express'
import { profileArtistInfoController } from '../controllers/artist/artistProfileInfoController'

export const profileRouter = express.Router()

// PENDIENTES
profileRouter.post('/artist/info', profileArtistInfoController)