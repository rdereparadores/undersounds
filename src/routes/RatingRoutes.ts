// import express from 'express';
// import { RatingCreationController } from '../controllers/ratings/RatingCreationController';
// import { RatingManagementController } from '../controllers/ratings/RatingManagementController';
//
// const router = express.Router();
// const ratingCreationController = new RatingCreationController();
// const ratingManagementController = new RatingManagementController();
//
// /**
//  * @swagger
//  * /api/ratings/create:
//  *   post:
//  *     summary: Create a new rating for a product
//  *     tags: [Ratings]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - rating
//  *               - title
//  *               - description
//  *               - author
//  *               - product
//  *             properties:
//  *               rating:
//  *                 type: number
//  *                 minimum: 1
//  *                 maximum: 5
//  *               title:
//  *                 type: string
//  *               description:
//  *                 type: string
//  *               author:
//  *                 type: string
//  *               product:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Rating created successfully
//  *       400:
//  *         description: Invalid input
//  *       409:
//  *         description: User has already rated this product
//  *       500:
//  *         description: Server error
//  */
// router.post('/create', ratingCreationController.createRating);
//
// /**
//  * @swagger
//  * /api/ratings/{id}:
//  *   put:
//  *     summary: Update an existing rating
//  *     tags: [Ratings]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               rating:
//  *                 type: number
//  *                 minimum: 1
//  *                 maximum: 5
//  *               title:
//  *                 type: string
//  *               description:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Rating updated successfully
//  *       403:
//  *         description: Not authorized to update this rating
//  *       404:
//  *         description: Rating not found
//  *       500:
//  *         description: Server error
//  */
// router.put('/:id', ratingManagementController.updateRating);
//
// /**
//  * @swagger
//  * /api/ratings/{id}:
//  *   delete:
//  *     summary: Delete a rating
//  *     tags: [Ratings]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Rating deleted successfully
//  *       403:
//  *         description: Not authorized to delete this rating
//  *       404:
//  *         description: Rating not found
//  *       500:
//  *         description: Server error
//  */
// router.delete('/:id', ratingManagementController.deleteRating);
//
// export default router;