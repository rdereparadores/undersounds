import express from 'express'
import { artistProfileController } from '../controllers/artist/artistProfileController'
import { artistProfileUpdateController } from '../controllers/artist/artistProfileUpdateController'
import {artistStatsController} from "../controllers/artist/artistStatsController";
import { artistProfileUpdateProfileImageController } from '../controllers/artist/artistProfileUpdateProfileImageController';
import { artistProfileUpdateBannerImageController } from '../controllers/artist/artistProfileUpdateBannerImageController';

export const artistRouter = express.Router()

artistRouter.get('/profile', artistProfileController)
artistRouter.post('/profile/update', artistProfileUpdateController)
artistRouter.post('/profile/update/profileImage', artistProfileUpdateProfileImageController)
artistRouter.post('/profile/update/bannerImage', artistProfileUpdateBannerImageController)
artistRouter.get('/stats', artistStatsController)