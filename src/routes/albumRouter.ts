import express from 'express'
import {albumInfoController} from "../controllers/album/albumInfoController";
import {albumRatingsController} from "../controllers/album/albumRatingsController";

export const albumRouter = express.Router()

albumRouter.get('info', albumInfoController)
albumRouter.get('ratings', albumRatingsController)