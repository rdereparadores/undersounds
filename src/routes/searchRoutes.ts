// src/routes/searchRoutes.ts
import express from 'express';
import * as productController from '../controllers/productController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Búsqueda
 *   description: Operaciones relacionadas con búsqueda de productos
 */

/**
 * @swagger
 * /api/search/products:
 *   get:
 *     summary: Buscar productos con filtros
 *     tags: [Búsqueda]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Texto a buscar en título o artista
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [song, album]
 *         description: Tipo de producto (canción o álbum)
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Género musical
 *       - in: query
 *         name: release_days
 *         schema:
 *           type: integer
 *         description: Lanzado en los últimos X días
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [relevance, newest, oldest]
 *           default: relevance
 *         description: Ordenar por relevancia, más nuevo o más antiguo
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Resultados por página
 *     responses:
 *       200:
 *         description: Lista de productos que coinciden con los criterios de búsqueda
 */
router.get('/products', productController.searchProducts);

/**
 * @swagger
 * /api/search/related-products/{id}:
 *   get:
 *     summary: Obtener productos relacionados
 *     tags: [Búsqueda]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto para encontrar relacionados
 *     responses:
 *       200:
 *         description: Lista de productos relacionados
 *       404:
 *         description: Producto no encontrado
 */
router.get('/related-products/:id', productController.getRelatedProducts);

export default router;