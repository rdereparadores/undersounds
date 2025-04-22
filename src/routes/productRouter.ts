import express from 'express'
import { productRecommendationsController } from '../controllers/product/productRecommendationsController'
import { productRatingsController } from '../controllers/product/productRatingsController'
import { productAddRatingController } from '../controllers/product/productAddRatingController'
import { productRemoveRatingController } from '../controllers/product/productRemoveRatingController'
import { productUpdateRatingController } from '../controllers/product/productUpdateRatingController'
import { productCheckUserRatingController } from '../controllers/product/productCheckUserRatingController'
import { productUserPurchasedFormatsController } from '../controllers/product/productUserPurchasedFormatsController'
import { authTokenMiddleware } from '../middleware/authTokenMiddleware'

export const productRouter = express.Router()

productRouter.post('/ratings', productRatingsController)

productRouter.post('/recommendations', productRecommendationsController)

productRouter.post('/add-rating', authTokenMiddleware, productAddRatingController)
productRouter.delete('/remove-rating', authTokenMiddleware, productRemoveRatingController)
productRouter.put('/update-rating', authTokenMiddleware, productUpdateRatingController)
productRouter.post('/user-rating', authTokenMiddleware, productCheckUserRatingController)
productRouter.post('/user-purchased-formats', authTokenMiddleware, productUserPurchasedFormatsController)