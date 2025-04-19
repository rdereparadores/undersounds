import express from 'express'
import {shopQueryController} from "../controllers/shop/shopQueryController";

export const shopRouter = express.Router()

// PENDIENTES
shopRouter.post('/query', shopQueryController)