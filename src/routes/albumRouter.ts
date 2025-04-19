import express from 'express'
import {albumInfoController} from "../controllers/album/albumInfoController"

export const albumRouter = express.Router()

albumRouter.post('/info', albumInfoController)