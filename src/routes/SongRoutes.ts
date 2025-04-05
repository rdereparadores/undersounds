// import express from 'express';
// import { SongInfoController } from '../controllers/songs/SongInfoController';
// import { SongTrendingController } from '../controllers/songs/SongTrendingController';
//
// const router = express.Router();
// const songInfoController = new SongInfoController();
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