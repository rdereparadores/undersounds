// import express from 'express';
// import pricingRoutes from './PricingRoutes';
//
// const router = express.Router();
//
// // Integrar rutas de pricing como subrutas de products
// router.use('/pricing', pricingRoutes);
//
// /**
//  * @swagger
//  * /api/products:
//  *   get:
//  *     summary: Get products with pagination
//  *     tags: [Products]
//  *     parameters:
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
//  *     responses:
//  *       200:
//  *         description: Products retrieved successfully
//  *       500:
//  *         description: Server error
//  */
// // Añadir más rutas para productos cuando los controladores estén disponibles
// // router.get('/', productController.getAllProducts);
//
// export default router;