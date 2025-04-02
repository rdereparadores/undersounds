// src/routes/reproductionRoutes.ts
import express from 'express';
import * as reproductionController from '../controllers/reproductionController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reproducciones
 *   description: Operaciones relacionadas con reproducciones de canciones
 */

/**
 * @swagger
 * /api/reproductions:
 *   post:
 *     summary: Registrar una reproducción
 *     tags: [Reproducciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - song
 *             properties:
 *               user:
 *                 type: string
 *               song:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reproducción registrada exitosamente
 *       404:
 *         description: Usuario o canción no encontrados
 */
router.post('/', reproductionController.createReproduction);

/**
 * @swagger
 * /api/reproductions/user/{userId}:
 *   get:
 *     summary: Obtener reproducciones de un usuario
 *     tags: [Reproducciones]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reproducciones del usuario
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/user/:userId', reproductionController.getUserReproductions);

/**
 * @swagger
 * /api/reproductions/song/{songId}:
 *   get:
 *     summary: Obtener reproducciones de una canción
 *     tags: [Reproducciones]
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reproducciones de la canción
 *       404:
 *         description: Canción no encontrada
 */
router.get('/song/:songId', reproductionController.getSongReproductions);

// Rutas protegidas para administradores
router.use(authMiddleware);
router.use(adminMiddleware);

/**
 * @swagger
 * /api/reproductions:
 *   get:
 *     summary: Obtener todas las reproducciones
 *     tags: [Reproducciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *       - in: query
 *         name: song
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista de reproducciones
 */
router.get('/', reproductionController.getReproductions);

/**
 * @swagger
 * /api/reproductions/stats:
 *   get:
 *     summary: Obtener estadísticas de reproducciones
 *     tags: [Reproducciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de reproducciones
 */
router.get('/stats', reproductionController.getReproductionStats);

/**
 * @swagger
 * /api/reproductions/{id}:
 *   delete:
 *     summary: Eliminar una reproducción
 *     tags: [Reproducciones]
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
 *         description: Reproducción eliminada exitosamente
 *       404:
 *         description: Reproducción no encontrada
 */
router.delete('/:id', reproductionController.deleteReproduction);

export default router;