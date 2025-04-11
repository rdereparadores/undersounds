import express from 'express'
import {trendingSongsController} from "../controllers/trending/trendingSongsController";

const trendingRouter = express.Router()

trendingRouter.get('songs', trendingSongsController)