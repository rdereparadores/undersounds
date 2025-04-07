import express from 'express'
import { genreAllController } from '../controllers/genre/getAllGenresController'

export const genreRouter = express.Router()

genreRouter.get('/all', genreAllController)