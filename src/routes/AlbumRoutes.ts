// // Actualización para AlbumRoutes.ts
// import express from 'express';
// import { AlbumInfoController } from '../controllers/albums/AlbumInfoController';
// import { AlbumRatingController } from '../controllers/albums/AlbumRatingController';
//
// const router = express.Router();
// const albumInfoController = new AlbumInfoController();
// const albumRatingController = new AlbumRatingController();
//
// /**
//  * @swagger
//  * /api/albums/info:
//  *   get:
//  *     summary: Get album information including tracklist and details
//  *     tags: [Albums]
//  *     parameters:
//  *       - in: query
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Album information retrieved successfully
//  *       404:
//  *         description: Album not found
//  *       500:
//  *         description: Server error
//  */
// router.get('/info', albumInfoController.getAlbumInfo);
//
// /**
//  * @swagger
//  * /api/albums/ratings:
//  *   get:
//  *     summary: Get album ratings and reviews
//  *     tags: [Albums]
//  *     parameters:
//  *       - in: query
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Album ratings retrieved successfully
//  *       404:
//  *         description: Album not found
//  *       500:
//  *         description: Server error
//  */
// router.get('/ratings', albumRatingController.getAlbumInfo);
//
// export default router;