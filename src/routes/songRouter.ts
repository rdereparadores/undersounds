import express from 'express'
import { songInfoController } from "../controllers/song/songInfoController"
import { songRatingController } from "../controllers/song/songRatingController"

export const songRouter = express.Router()

// REVISADAS
songRouter.post('/info', songInfoController)
songRouter.post('/ratings', songRatingController)