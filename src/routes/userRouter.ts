import express from 'express'
import { userIsFollowingController } from '../controllers/user/userIsFollowingController'
import { userLibrarySongsController } from '../controllers/user/userLibrarySongsController'
import { userLibraryAlbumsController } from '../controllers/user/userLibraryAlbumsController'
import { userOrdersController } from '../controllers/order/userOrdersController'
import { userOrdersOrderController } from '../controllers/order/userOrdersOrderController'
import { userProfileAddressAddController } from '../controllers/user/userProfileAddressAddController'
import { userProfileAddressSetDefaultController } from '../controllers/user/userProfileAddressSetDefaultController'
import { userProfileController } from '../controllers/user/userProfileController'
import { userProfileUpdateController } from '../controllers/user/userProfileUpdateController'
import { userProfileUpdateImageController } from '../controllers/user/userProfileUpdateImageController'
import { userProfileAddressController } from '../controllers/user/userProfileAddressController'
import { userProfileAddressRemoveController } from '../controllers/user/userProfileAddressRemoveController'
import { userStatsController } from "../controllers/user/userStatsController";
import { userFeaturedArtistsController } from "../controllers/user/userFeaturedArtistsController"
import { userEmailUpdateController } from "../controllers/user/userEmailUpadteController"
import { userPasswordResetController } from "../controllers/user/userPasswordUpdateController"
import { librarySearchController } from "../controllers/user/userLibraryQueryController"
import { userFeaturedContentController } from '../controllers/user/userFeaturedContentController'

export const userRouter = express.Router()


// REVISADAS
userRouter.get('/profile', userProfileController)
userRouter.get('/profile/address', userProfileAddressController)
userRouter.post('/profile/update', userProfileUpdateController)
userRouter.post('/profile/update/image', userProfileUpdateImageController)
userRouter.post('/profile/address/add', userProfileAddressAddController)
userRouter.post('/profile/address/remove', userProfileAddressRemoveController)
userRouter.post('/is-following', userIsFollowingController)
userRouter.patch('/profile/address/set-default', userProfileAddressSetDefaultController)
userRouter.get('featured/content', userFeaturedContentController)
userRouter.get('featured/artists', userFeaturedArtistsController)
userRouter.get('/library/songs', userLibrarySongsController)
userRouter.get('/library/albums', userLibraryAlbumsController)
userRouter.get('/orders', userOrdersController)
userRouter.post('/orders/order', userOrdersOrderController)



// NO REVISADAS
userRouter.get('/stats', userStatsController)
userRouter.post('/profile/update/email', userEmailUpdateController)
userRouter.post('/profile/update/password', userPasswordResetController)

// IMPLEMENTACION NO NECESARIA (POR AHORA)
// userRouter.post('/library/query', librarySearchController)
