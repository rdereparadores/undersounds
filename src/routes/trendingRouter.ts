import express from 'express'

const trendingRouter = express.Router()

trendingRouter.get('songs', trendingSongsController)