// import express from 'express';
// import { GetAllGenresController } from '../controllers/genres/GetAllGenresController';
// import { GetGenreByIdController } from '../controllers/genres/GetGenreByIdController';
// import { GetProductsByGenreController } from '../controllers/genres/GetProductsByGenreController';
//
// const router = express.Router();
// const getAllGenresController = new GetAllGenresController();
// const getGenreByIdController = new GetGenreByIdController();
// const getProductsByGenreController = new GetProductsByGenreController();
//
// /**
//  * @swagger
//  * /api/genres:
//  *   get:
//  *     summary: Get all music genres
//  *     tags: [Genres]
//  *     responses:
//  *       200:
//  *         description: List of all genres
//  *       500:
//  *         description: Server error
//  */
// router.get('/', getAllGenresController.getAllGenres);
//
// /**
//  * @swagger
//  * /api/genres/{id}:
//  *   get:
//  *     summary: Get genre by ID
//  *     tags: [Genres]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Genre details
//  *       404:
//  *         description: Genre not found
//  *       500:
//  *         description: Server error
//  */
// router.get('/:id', getGenreByIdController.getGenreById);
//
// /**
//  * @swagger
//  * /api/genres/{id}/products:
//  *   get:
//  *     summary: Get products by genre
//  *     tags: [Genres]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *           default: 1
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *           default: 10
//  *       - in: query
//  *         name: productType
//  *         schema:
//  *           type: string
//  *           enum: [song, album]
//  *     responses:
//  *       200:
//  *         description: Products for the specified genre
//  *       404:
//  *         description: Genre not found
//  *       500:
//  *         description: Server error
//  */
// router.get('/:id/products', getProductsByGenreController.getProductsByGenre);
//
// export default router;