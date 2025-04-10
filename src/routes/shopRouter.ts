import express from 'express'
import {shopQueryController} from "../controllers/shop/shopQueryController";

export const shopRouter = express.Router()

shopRouter.post('/query', shopQueryController)