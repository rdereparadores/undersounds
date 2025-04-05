// import express from 'express';
// import { GetProductsPricingController } from '../controllers/products/pricing/GetProductsPricingController';
// import { ComparePricingController } from '../controllers/products/pricing/ComparePricingController';
// import { UpdateProductsPricingController } from '../controllers/products/pricing/UpdateProductsPricingController';
// import { ProductQueryController } from '../controllers/shop/ProductQueryController';
// // Importar middleware de autenticación y autorización cuando esté disponible
// // import { authenticate, authorize } from '../middleware/AuthMiddleware';
//
// const router = express.Router();
// const getProductsPricingController = new GetProductsPricingController();
// const comparePricingController = new ComparePricingController();
// const updateProductsPricingController = new UpdateProductsPricingController();
// const productQueryController = new ProductQueryController();
//
// /**
//  * @swagger
//  * /api/products/query:
//  *   get:
//  *     summary: Search for products with various filters
//  *     tags: [Products]
//  *     parameters:
//  *       - in: query
//  *         name: query
//  *         schema:
//  *           type: string
//  *         description: Text search term
//  *       - in: query
//  *         name: artist
//  *         schema:
//  *           type: string
//  *         description: Artist ID
//  *       - in: query
//  *         name: startDate
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: Release date range start
//  *       - in: query
//  *         name: endDate
//  *         schema:
//  *           type: string
//  *           format: date
//  *         description: Release date range end
//  *       - in: query
//  *         name: genres
//  *         schema:
//  *           type: string
//  *         description: Comma-separated list of genre IDs
//  *       - in: query
//  *         name: sortBy
//  *         schema:
//  *           type: string
//  *           enum: [price, releaseDate, popularity, title]
//  *           default: releaseDate
//  *       - in: query
//  *         name: sortOrder
//  *         schema:
//  *           type: string
//  *           enum: [asc, desc]
//  *           default: desc
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
//  *           enum: [Album, Song]
//  *     responses:
//  *       200:
//  *         description: Products retrieved successfully
//  *       400:
//  *         description: Invalid query parameters
//  *       500:
//  *         description: Server error
//  */
// router.get('/query', productQueryController.queryProducts);
//
// /**
//  * @swagger
//  * /api/products/pricing/{productId}:
//  *   get:
//  *     summary: Get product pricing
//  *     tags: [Products, Pricing]
//  *     parameters:
//  *       - in: path
//  *         name: productId
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Product pricing retrieved successfully
//  *       404:
//  *         description: Product not found
//  *       500:
//  *         description: Server error
//  *   put:
//  *     summary: Update product pricing (admin only)
//  *     tags: [Products, Pricing]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: productId
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
//  *               cd:
//  *                 type: number
//  *                 minimum: 0
//  *               digital:
//  *                 type: number
//  *                 minimum: 0
//  *               cassette:
//  *                 type: number
//  *                 minimum: 0
//  *               vinyl:
//  *                 type: number
//  *                 minimum: 0
//  *     responses:
//  *       200:
//  *         description: Product pricing updated successfully
//  *       400:
//  *         description: Invalid pricing data
//  *       403:
//  *         description: Not authorized
//  *       404:
//  *         description: Product not found
//  *       500:
//  *         description: Server error
//  */
// router.get('/pricing/:productId', getProductsPricingController.getProductPricing);
// // Añadir middleware de autenticación y autorización cuando esté disponible
// // router.put('/pricing/:productId', authenticate, authorize('admin'), updateProductsPricingController.updateProductPricing);
// router.put('/pricing/:productId', updateProductsPricingController.updateProductPricing);
//
// /**
//  * @swagger
//  * /api/products/pricing/compare:
//  *   get:
//  *     summary: Compare pricing between products
//  *     tags: [Products, Pricing]
//  *     parameters:
//  *       - in: query
//  *         name: productIds
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Comma-separated list of product IDs to compare
//  *     responses:
//  *       200:
//  *         description: Product pricing comparison retrieved successfully
//  *       400:
//  *         description: Invalid product IDs
//  *       404:
//  *         description: One or more products not found
//  *       500:
//  *         description: Server error
//  */
// router.get('/pricing/compare', comparePricingController.compareProductsPricing);
//
// export default router;