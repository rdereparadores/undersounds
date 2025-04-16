import express from 'express'
import { aiImageController } from '../controllers/ai/aiImageController'

export const aiRouter = express.Router()

aiRouter.post('/image', aiImageController)