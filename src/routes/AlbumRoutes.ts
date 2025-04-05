// import express from 'express';
// import { AlbumInfoController } from '../controllers/albums/AlbumInfoController';
//
// const router = express.Router();
// const albumInfoController = new AlbumInfoController();
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
// export default router;