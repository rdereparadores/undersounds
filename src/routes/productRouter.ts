import express from 'express'
import { productRecommendationsController } from '../controllers/product/productRecommendationsController'
import { productRatingsController } from '../controllers/product/productRatingsController'
import { authTokenMiddleware } from '../middleware/authTokenMiddleware'
import { productRatingsAddController } from '../controllers/product/productRatingsAddController'
import { productRatingsRemoveController } from '../controllers/product/productRatingsRemoveController'
import { productRatingsUpdateController } from '../controllers/product/productRatingsUpdateController'
import { productRatingsUserController } from '../controllers/product/productRatingsUserController'

export const productRouter = express.Router()

productRouter.post('/ratings', productRatingsController)
productRouter.post('/ratings/add', authTokenMiddleware, productRatingsAddController)
productRouter.post('/ratings/remove', authTokenMiddleware, productRatingsRemoveController)
productRouter.post('/ratings/update', authTokenMiddleware, productRatingsUpdateController)
productRouter.post('/ratings/user', authTokenMiddleware, productRatingsUserController)

productRouter.post('/recommendations', productRecommendationsController)