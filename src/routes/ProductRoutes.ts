// import express from 'express';
// import { ProductController } from '../controllers/ProductController';
//
// const router = express.Router();
// const productController = new ProductController();
//
// // General product routes
// router.get('/', productController.getAllProducts);
// router.get('/:id', productController.getProductById);
// router.post('/', productController.createProduct);
// router.put('/:id', productController.updateProduct);
// router.delete('/:id', productController.deleteProduct);
//
// // Search and filter routes
// router.get('/search', productController.searchProductsByTitle);
// router.get('/date-range', productController.getProductsByDateRange);
// router.get('/compare-pricing', productController.compareProductsPricing);
//
// // Pricing routes
// router.get('/:id/pricing', productController.getProductPricing);
// router.put('/:id/pricing', productController.updateProductPricing);
//
// export default router;