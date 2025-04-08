import express from 'express'
import { aiCoverController } from '../controllers/ai/aiCoverController'

export const aiRouter = express.Router()

aiRouter.post('/cover', aiCoverController)