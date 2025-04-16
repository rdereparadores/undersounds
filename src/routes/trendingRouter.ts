import express from 'express'
import {trendingSongsController} from "../controllers/trending/trendingSongsController";

export const trendingRouter = express.Router()

trendingRouter.get('songs', trendingSongsController)