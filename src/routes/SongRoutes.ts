// // Actualización para SongRoutes.ts
// import express from 'express';
// import { SongInfoController } from '../controllers/songs/SongInfoController';
// import { SongRatingController } from '../controllers/songs/SongRatingController';
// import { SongTrendingController } from '../controllers/songs/SongTrendingController';
//
// const router = express.Router();
// const songInfoController = new SongInfoController();
// const songRatingController = new SongRatingController();
// const songTrendingController = new SongTrendingController();
//
// /**
//  * @swagger
//  * /api/songs/info:
//  *   get:
//  *     summary: Get song information including artists and recommendations
//  *     tags: [Songs]
//  *     parameters:
//  *       - in: query
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Song information retrieved successfully
//  *       404:
//  *         description: Song not found
//  *       500:
//  *         description: Server error
//  */
// router.get('/info', songInfoController.getSongInfo);
//
// /**
//  * @swagger
//  * /api/songs/ratings:
//  *   get:
//  *     summary: Get song ratings and reviews
//  *     tags: [Songs]
//  *     parameters:
//  *       - in: query
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Song ratings retrieved successfully
//  *       404:
//  *         description: Song not found
//  *       500:
//  *         description: Server error
//  */
// router.get('/ratings', songRatingController.getSongInfo);
//
// /**
//  * @swagger
//  * /api/songs/trending:
//  *   get:
//  *     summary: Get top trending songs
//  *     tags: [Songs]
//  *     responses:
//  *       200:
//  *         description: Trending songs retrieved successfully
//  *       500:
//  *         description: Server error
//  */
// router.get('/trending', songTrendingController.getTrendingSongs);
//
// export default router;