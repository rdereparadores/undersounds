// src/routes/albumRoutes.ts
import express from 'express';
import * as albumController from '../controllers/albumController';
import { authMiddleware, artistMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Álbumes
 *   description: Operaciones relacionadas con álbumes
 */

/**
 * @swagger
 * /api/albums:
 *   get:
 *     summary: Obtener todos los álbumes
 *     tags: [Álbumes]
 *     parameters:
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *       - in: query
 *         name: artist
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de álbumes
 */
router.get('/', albumController.getAlbums);

/**
 * @swagger
 * /api/albums/{id}:
 *   get:
 *     summary: Obtener un álbum por ID
 *     tags: [Álbumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del álbum
 *       404:
 *         description: Álbum no encontrado
 */
router.get('/:id', albumController.getAlbumById);

// Rutas protegidas para artistas
router.use(authMiddleware);
router.use(artistMiddleware);

/**
 * @swagger
 * /api/albums:
 *   post:
 *     summary: Crear un nuevo álbum
 *     tags: [Álbumes]
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
 *               format:
 *                 type: string
 *               url_download:
 *                 type: string
 *               artists:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Álbum creado exitosamente
 *       400:
 *         description: Datos inválidos en la petición
 */
router.post('/', albumController.createAlbum);

/**
 * @swagger
 * /api/albums/{id}:
 *   put:
 *     summary: Actualizar un álbum
 *     tags: [Álbumes]
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
 *               format:
 *                 type: string
 *               url_download:
 *                 type: string
 *     responses:
 *       200:
 *         description: Álbum actualizado exitosamente
 *       404:
 *         description: Álbum no encontrado
 */
router.put('/:id', albumController.updateAlbum);

/**
 * @swagger
 * /api/albums/{id}:
 *   delete:
 *     summary: Eliminar un álbum
 *     tags: [Álbumes]
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
 *         description: Álbum eliminado exitosamente
 *       404:
 *         description: Álbum no encontrado
 */
router.delete('/:id', albumController.deleteAlbum);

/**
 * @swagger
 * /api/albums/{id}/songs:
 *   post:
 *     summary: Agregar canciones a un álbum
 *     tags: [Álbumes]
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
 *               - songIds
 *             properties:
 *               songIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Canciones agregadas exitosamente
 *       404:
 *         description: Álbum no encontrado
 */
router.post('/:id/songs', albumController.addSongsToAlbum);

export default router;