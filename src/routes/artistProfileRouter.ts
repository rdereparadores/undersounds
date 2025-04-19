import express from 'express'
import {artistProfileInfoController} from "../controllers/artist/artistProfileInfoController";

const artistProfileRouter = express.Router()

// PENDIENTES
artistProfileRouter.get('/info', artistProfileInfoController)