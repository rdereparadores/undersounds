// src/routes/songRoutes.ts
import express from 'express';
import * as songController from '../controllers/songController';
import { authMiddleware, artistMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Canciones
 *   description: Operaciones relacionadas con canciones
 */

/**
 * @swagger
 * /api/songs:
 *   get:
 *     summary: Obtener todas las canciones
 *     tags: [Canciones]
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *       - in: query
 *         name: album
 *         schema:
 *           type: string
 *       - in: query
 *         name: artist
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de canciones
 */
router.get('/', songController.getSongs);

/**
 * @swagger
 * /api/songs/{id}:
 *   get:
 *     summary: Obtener una canción por ID
 *     tags: [Canciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos de la canción
 *       404:
 *         description: Canción no encontrada
 */
router.get('/:id', songController.getSongById);

/**
 * @swagger
 * /api/songs/{id}/reproduce:
 *   post:
 *     summary: Registrar reproducción de una canción
 *     tags: [Canciones]
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
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reproducción registrada exitosamente
 *       404:
 *         description: Canción no encontrada
 */
router.post('/:id/reproduce', songController.addReproduction);

// Rutas protegidas para artistas
router.use(authMiddleware);
router.use(artistMiddleware);

/**
 * @swagger
 * /api/songs:
 *   post:
 *     summary: Crear una nueva canción
 *     tags: [Canciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - artists
 *             properties:
 *               name:
 *                 type: string
 *               publish_date:
 *                 type: string
 *                 format: date
 *               genre:
 *                 type: string
 *               description:
 *                 type: string
 *               url_image:
 *                 type: string
 *               duration:
 *                 type: number
 *               url_song:
 *                 type: string
 *               format:
 *                 type: string
 *               url_download:
 *                 type: string
 *               album:
 *                 type: string
 *               artists:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Canción creada exitosamente
 *       400:
 *         description: Datos inválidos en la petición
 */
router.post('/', songController.createSong);

/**
 * @swagger
 * /api/songs/{id}:
 *   put:
 *     summary: Actualizar una canción
 *     tags: [Canciones]
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
 *             properties:
 *               name:
 *                 type: string
 *               publish_date:
 *                 type: string
 *                 format: date
 *               genre:
 *                 type: string
 *               description:
 *                 type: string
 *               url_image:
 *                 type: string
 *               duration:
 *                 type: number
 *               url_song:
 *                 type: string
 *               format:
 *                 type: string
 *               url_download:
 *                 type: string
 *               album:
 *                 type: string
 *     responses:
 *       200:
 *         description: Canción actualizada exitosamente
 *       404:
 *         description: Canción no encontrada
 */
router.put('/:id', songController.updateSong);

/**
 * @swagger
 * /api/songs/{id}:
 *   delete:
 *     summary: Eliminar una canción
 *     tags: [Canciones]
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
 *         description: Canción eliminada exitosamente
 *       404:
 *         description: Canción no encontrada
 */
router.delete('/:id', songController.deleteSong);

export default router;