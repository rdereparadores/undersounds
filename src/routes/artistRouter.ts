import express from 'express'
import { artistProfileController } from '../controllers/artist/artistProfileController'
import { artistProfileUpdateController } from '../controllers/artist/artistProfileUpdateController'
import {artistStatsController} from "../controllers/artist/artistStatsController";
import { artistProfileUpdateProfileImageController } from '../controllers/artist/artistProfileUpdateProfileImageController';
import { artistProfileUpdateBannerImageController } from '../controllers/artist/artistProfileUpdateBannerImageController';
import { artistReleaseSongController } from '../controllers/artist/artistReleaseSongController';
import { artistSongsController } from '../controllers/artist/artistSongsController'
import { artistAlbumsController } from '../controllers/artist/artistAlbumsController';
import { artistReleaseAlbumController } from '../controllers/artist/artistReleaseAlbumController';

export const artistRouter = express.Router()

// REVISADAS
artistRouter.get('/profile', artistProfileController)
artistRouter.get('/songs', artistSongsController)
artistRouter.get('/albums', artistAlbumsController)
artistRouter.post('/profile/update', artistProfileUpdateController)
artistRouter.post('/profile/update/profileImage', artistProfileUpdateProfileImageController)
artistRouter.post('/profile/update/bannerImage', artistProfileUpdateBannerImageController)
artistRouter.post('/release/song', artistReleaseSongController)

// PENDIENTES
artistRouter.post('/release/album', artistReleaseAlbumController)

// SIN REVISAR
//artistRouter.get('/stats', artistStatsController)