import express from 'express'
import {albumInfoController} from "../controllers/album/albumInfoController"

export const albumRouter = express.Router()

// PENDIENTES
albumRouter.get('/info', albumInfoController)