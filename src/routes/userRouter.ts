import express from 'express'

export const userRouter = express.Router()

userRouter.get('is-following', userIsFollowingController)
userRouter.get('profile', userProfileController)
userRouter.get('profile/address', userProfileAddressController)
//userRouter.get('dashboard/featured/content', userDashboardFeaturedContentController)
//userRouter.get('dashboard/featured/artists', userDashbordFeaturedArtistsController)
userRouter.get('library/songs', userLibrarySongsController)
userRouter.get('library/albums', userLibraryAlbumsController)
userRouter.get('orders', userOrdersController)
userRouter.get('orders/order', userOrdersOrderController)
//userRouter.get('stats', userStatsController)

userRouter.post('profile/address/add', userProfileAddressAddController)
userRouter.post('profile/update', userProfileUpdateController)
userRouter.post('profile/update/email', userProfileUpdateEmailController)
userRouter.post('profile/update/password', userProfileUpdatePasswordController)
userRouter.post('library/query', userLibraryQueryController)

userRouter.patch('profile/address/set-default', userProfileAddressSetDefaultController)