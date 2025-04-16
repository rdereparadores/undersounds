import express from 'express'
import { genreAllController } from '../controllers/genre/genreAllController'

export const genreRouter = express.Router()

genreRouter.get('/all', genreAllController)