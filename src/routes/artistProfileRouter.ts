import express from 'express'
import {artistProfileInfoController} from "../controllers/artist/artistProfileInfoController";

export const artistProfileRouter = express.Router()

// PENDIENTES
artistProfileRouter.get('/info', artistProfileInfoController)