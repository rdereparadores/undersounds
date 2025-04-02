// src/routes/formatRoutes.ts
import express from 'express';
import * as formatController from '../controllers/formatController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Formatos
 *   description: Operaciones relacionadas con formatos de música
 */

/**
 * @swagger
 * /api/formats:
 *   get:
 *     summary: Obtener todos los formatos
 *     tags: [Formatos]
 *     responses:
 *       200:
 *         description: Lista de formatos
 */
router.get('/', formatController.getFormats);

/**
 * @swagger
 * /api/formats/{id}:
 *   get:
 *     summary: Obtener un formato por ID
 *     tags: [Formatos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del formato
 *       404:
 *         description: Formato no encontrado
 */
router.get('/:id', formatController.getFormatById);

/**
 * @swagger
 * /api/formats/{id}/songs:
 *   get:
 *     summary: Obtener canciones por formato
 *     tags: [Formatos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Canciones del formato
 *       404:
 *         description: Formato no encontrado
 */
router.get('/:id/songs', formatController.getSongsByFormat);

/**
 * @swagger
 * /api/formats/{id}/albums:
 *   get:
 *     summary: Obtener álbumes por formato
 *     tags: [Formatos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Álbumes del formato
 *       404:
 *         description: Formato no encontrado
 */
router.get('/:id/albums', formatController.getAlbumsByFormat);

// Rutas protegidas para administradores
router.use(authMiddleware);
router.use(adminMiddleware);

/**
 * @swagger
 * /api/formats:
 *   post:
 *     summary: Crear un nuevo formato
 *     tags: [Formatos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - format
 *             properties:
 *               format:
 *                 type: string
 *     responses:
 *       201:
 *         description: Formato creado exitosamente
 *       400:
 *         description: El formato ya existe
 */
router.post('/', formatController.createFormat);

/**
 * @swagger
 * /api/formats/{id}:
 *   put:
 *     summary: Actualizar un formato
 *     tags: [Formatos]
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
 *               - format
 *             properties:
 *               format:
 *                 type: string
 *     responses:
 *       200:
 *         description: Formato actualizado exitosamente
 *       404:
 *         description: Formato no encontrado
 */
router.put('/:id', formatController.updateFormat);

/**
 * @swagger
 * /api/formats/{id}:
 *   delete:
 *     summary: Eliminar un formato
 *     tags: [Formatos]
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
 *         description: Formato eliminado exitosamente
 *       404:
 *         description: Formato no encontrado
 */
router.delete('/:id', formatController.deleteFormat);

export default router;