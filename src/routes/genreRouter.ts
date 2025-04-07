import express from 'express'

const genreRouter = express.Router()

genreRouter.get('all', genreAllController)