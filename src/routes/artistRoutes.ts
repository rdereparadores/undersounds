// src/routes/artistRoutes.ts
import express from 'express';
import * as artistController from '../controllers/artistController';
import * as artistProfileController from '../controllers/artistProfileController';
import { authMiddleware, artistMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Artistas
 *   description: Operaciones relacionadas con artistas
 */

/**
 * @swagger
 * /api/artists:
 *   get:
 *     summary: Obtener todos los artistas
 *     tags: [Artistas]
 *     responses:
 *       200:
 *         description: Lista de artistas
 */
router.get('/', artistController.getArtists);

/**
 * @swagger
 * /api/artists/{id}:
 *   get:
 *     summary: Obtener un artista por ID
 *     tags: [Artistas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del artista
 *       404:
 *         description: Artista no encontrado
 */
router.get('/:id', artistController.getArtistById);

/**
 * @swagger
 * /api/artists/{id}/songs:
 *   get:
 *     summary: Obtener canciones de un artista
 *     tags: [Artistas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Canciones del artista
 *       404:
 *         description: Artista no encontrado
 */
router.get('/:id/songs', artistController.getArtistSongs);

/**
 * @swagger
 * /api/artists/{id}/albums:
 *   get:
 *     summary: Obtener álbumes de un artista
 *     tags: [Artistas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Álbumes del artista
 *       404:
 *         description: Artista no encontrado
 */
router.get('/:id/albums', artistController.getArtistAlbums);

/**
 * @swagger
 * /api/artists/profile/{id}:
 *   get:
 *     summary: Obtener perfil de artista
 *     tags: [Artistas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Perfil del artista
 *       404:
 *         description: Artista no encontrado
 */
router.get('/profile/:id', artistProfileController.getArtistProfile);

/**
 * @swagger
 * /api/artists/{id}/follow:
 *   post:
 *     summary: Seguir/dejar de seguir a un artista
 *     tags: [Artistas]
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
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Operación exitosa
 *       404:
 *         description: Artista no encontrado
 */
router.post('/:id/follow', authMiddleware, artistProfileController.toggleFollowArtist);

/**
 * @swagger
 * /api/artists/{id}/top-songs:
 *   get:
 *     summary: Obtener top canciones de un artista
 *     tags: [Artistas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       200:
 *         description: Top canciones del artista
 *       404:
 *         description: Artista no encontrado
 */
router.get('/:id/top-songs', artistProfileController.getArtistTopSongs);

/**
 * @swagger
 * /api/artists/{id}/latest-release:
 *   get:
 *     summary: Obtener último lanzamiento de un artista
 *     tags: [Artistas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Último lanzamiento del artista
 *       404:
 *         description: Artista no encontrado o sin lanzamientos
 */
router.get('/:id/latest-release', artistProfileController.getArtistLatestRelease);

// Rutas protegidas para artistas
router.use(authMiddleware);
router.use(artistMiddleware);

/**
 * @swagger
 * /api/artists:
 *   post:
 *     summary: Crear un nuevo artista
 *     tags: [Artistas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - artist_name
 *               - email
 *               - password
 *             properties:
 *               artist_name:
 *                 type: string
 *               real_name:
 *                 type: string
 *               birth_date:
 *                 type: string
 *                 format: date
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               record_label:
 *                 type: string
 *               bank_account:
 *                 type: string
 *     responses:
 *       201:
 *         description: Artista creado exitosamente
 *       400:
 *         description: Datos inválidos en la petición
 */
router.post('/', artistController.createArtist);

/**
 * @swagger
 * /api/artists/{id}:
 *   put:
 *     summary: Actualizar un artista
 *     tags: [Artistas]
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
 *               artist_name:
 *                 type: string
 *               real_name:
 *                 type: string
 *               birth_date:
 *                 type: string
 *                 format: date
 *               email:
 *                 type: string
 *               record_label:
 *                 type: string
 *               bank_account:
 *                 type: string
 *     responses:
 *       200:
 *         description: Artista actualizado exitosamente
 *       404:
 *         description: Artista no encontrado
 */
router.put('/:id', artistController.updateArtist);

/**
 * @swagger
 * /api/artists/{id}:
 *   delete:
 *     summary: Eliminar un artista
 *     tags: [Artistas]
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
 *         description: Artista eliminado exitosamente
 *       404:
 *         description: Artista no encontrado
 */
router.delete('/:id', artistController.deleteArtist);

/**
 * @swagger
 * /api/artists/{id}/sales-stats:
 *   get:
 *     summary: Obtener estadísticas de ventas del artista
 *     tags: [Artistas]
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
 *         description: Estadísticas de ventas del artista
 *       404:
 *         description: Artista no encontrado
 */
router.get('/:id/sales-stats', artistProfileController.getArtistSalesStats);

export default router;