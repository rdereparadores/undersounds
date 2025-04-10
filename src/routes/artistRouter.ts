import express from 'express'
import { artistProfileController } from '../controllers/artist/artistProfileController'
import { artistProfileUpdateController } from '../controllers/artist/artistProfileUpdateController'
import {artistStatsController} from "../controllers/artist/artistStatsController";

export const artistRouter = express.Router()

artistRouter.get('/profile', artistProfileController)
artistRouter.post('/profile/update', artistProfileUpdateController)
artistRouter.get('/stats', artistStatsController)