// src/routes/scoreRoutes.ts
import express from 'express';
import * as scoreController from '../controllers/scoreController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Valoraciones
 *   description: Operaciones relacionadas con valoraciones de productos
 */

/**
 * @swagger
 * /api/scores:
 *   get:
 *     summary: Obtener todas las valoraciones
 *     tags: [Valoraciones]
 *     parameters:
 *       - in: query
 *         name: album
 *         schema:
 *           type: string
 *       - in: query
 *         name: song
 *         schema:
 *           type: string
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de valoraciones
 */
router.get('/', scoreController.getScores);

/**
 * @swagger
 * /api/scores/{id}:
 *   get:
 *     summary: Obtener una valoración por ID
 *     tags: [Valoraciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos de la valoración
 *       404:
 *         description: Valoración no encontrada
 */
router.get('/:id', scoreController.getScoreById);

/**
 * @swagger
 * /api/scores/album/{id}/average:
 *   get:
 *     summary: Obtener promedio de valoraciones de un álbum
 *     tags: [Valoraciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promedio de valoraciones
 *       404:
 *         description: Álbum no encontrado
 */
router.get('/album/:id/average', scoreController.getAlbumAverageScore);

/**
 * @swagger
 * /api/scores/song/{id}/average:
 *   get:
 *     summary: Obtener promedio de valoraciones de una canción
 *     tags: [Valoraciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promedio de valoraciones
 *       404:
 *         description: Canción no encontrada
 */
router.get('/song/:id/average', scoreController.getSongAverageScore);

// Rutas protegidas que requieren autenticación
router.use(authMiddleware);

/**
 * @swagger
 * /api/scores:
 *   post:
 *     summary: Crear una nueva valoración
 *     tags: [Valoraciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - score
 *             properties:
 *               user:
 *                 type: string
 *               album:
 *                 type: string
 *               song:
 *                 type: string
 *               score:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 10
 *               opinion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Valoración creada exitosamente
 *       400:
 *         description: Datos inválidos o valoración duplicada
 *       404:
 *         description: Usuario, álbum o canción no encontrados
 */
router.post('/', scoreController.createScore);

/**
 * @swagger
 * /api/scores/{id}:
 *   put:
 *     summary: Actualizar una valoración
 *     tags: [Valoraciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *             properties:
 *               score:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 10
 *               opinion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Valoración actualizada exitosamente
 *       404:
 *         description: Valoración no encontrada
 */
router.put('/:id', scoreController.updateScore);

/**
 * @swagger
 * /api/scores/{id}:
 *   delete:
 *     summary: Eliminar una valoración
 *     tags: [Valoraciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Valoración eliminada exitosamente
 *       404:
 *         description: Valoración no encontrada
 */
router.delete('/:id', scoreController.deleteScore);

export default router;