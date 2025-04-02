// src/routes/genreRoutes.ts
import express from 'express';
import * as genreController from '../controllers/genreController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Géneros
 *   description: Operaciones relacionadas con géneros musicales
 */

/**
 * @swagger
 * /api/genres:
 *   get:
 *     summary: Obtener todos los géneros
 *     tags: [Géneros]
 *     responses:
 *       200:
 *         description: Lista de géneros
 */
router.get('/', genreController.getGenres);

/**
 * @swagger
 * /api/genres/{id}:
 *   get:
 *     summary: Obtener un género por ID
 *     tags: [Géneros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del género
 *       404:
 *         description: Género no encontrado
 */
router.get('/:id', genreController.getGenreById);

/**
 * @swagger
 * /api/genres/{id}/songs:
 *   get:
 *     summary: Obtener canciones por género
 *     tags: [Géneros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Canciones del género
 *       404:
 *         description: Género no encontrado
 */
router.get('/:id/songs', genreController.getSongsByGenre);

/**
 * @swagger
 * /api/genres/{id}/albums:
 *   get:
 *     summary: Obtener álbumes por género
 *     tags: [Géneros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Álbumes del género
 *       404:
 *         description: Género no encontrado
 */
router.get('/:id/albums', genreController.getAlbumsByGenre);

// Rutas protegidas para administradores
router.use(authMiddleware);
router.use(adminMiddleware);

/**
 * @swagger
 * /api/genres:
 *   post:
 *     summary: Crear un nuevo género
 *     tags: [Géneros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - genre
 *             properties:
 *               genre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Género creado exitosamente
 *       400:
 *         description: El género ya existe
 */
router.post('/', genreController.createGenre);

/**
 * @swagger
 * /api/genres/{id}:
 *   put:
 *     summary: Actualizar un género
 *     tags: [Géneros]
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
 *               - genre
 *             properties:
 *               genre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Género actualizado exitosamente
 *       404:
 *         description: Género no encontrado
 */
router.put('/:id', genreController.updateGenre);

/**
 * @swagger
 * /api/genres/{id}:
 *   delete:
 *     summary: Eliminar un género
 *     tags: [Géneros]
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
 *         description: Género eliminado exitosamente
 *       404:
 *         description: Género no encontrado
 */
router.delete('/:id', genreController.deleteGenre);

export default router;