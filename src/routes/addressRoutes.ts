// src/routes/addressRoutes.ts
import express from 'express';
import * as addressController from '../controllers/addressController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Direcciones
 *   description: Operaciones relacionadas con direcciones
 */

// Todas las rutas de direcciones requieren autenticación
router.use(authMiddleware);

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     summary: Obtener todas las direcciones
 *     tags: [Direcciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de direcciones
 */
router.get('/', addressController.getAddresses);

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Crear una nueva dirección independiente
 *     tags: [Direcciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *             properties:
 *               alias:
 *                 type: string
 *               address:
 *                 type: string
 *               province:
 *                 type: string
 *               city:
 *                 type: string
 *               zip_code:
 *                 type: string
 *               country:
 *                 type: string
 *               observations:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dirección creada exitosamente
 *       400:
 *         description: Datos inválidos en la petición
 */
router.post('/', addressController.createAddress);

/**
 * @swagger
 * /api/addresses/{id}:
 *   get:
 *     summary: Obtener una dirección por ID
 *     tags: [Direcciones]
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
 *         description: Datos de la dirección
 *       404:
 *         description: Dirección no encontrada
 */
router.get('/:id', addressController.getAddressById);

/**
 * @swagger
 * /api/addresses/{id}:
 *   put:
 *     summary: Actualizar una dirección
 *     tags: [Direcciones]
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
 *               alias:
 *                 type: string
 *               address:
 *                 type: string
 *               province:
 *                 type: string
 *               city:
 *                 type: string
 *               zip_code:
 *                 type: string
 *               country:
 *                 type: string
 *               observations:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dirección actualizada exitosamente
 *       404:
 *         description: Dirección no encontrada
 */
router.put('/:id', addressController.updateAddress);

/**
 * @swagger
 * /api/addresses/{id}:
 *   delete:
 *     summary: Eliminar una dirección
 *     tags: [Direcciones]
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
 *         description: Dirección eliminada exitosamente
 *       400:
 *         description: No se puede eliminar la dirección porque está asociada a usuarios o artistas
 *       404:
 *         description: Dirección no encontrada
 */
router.delete('/:id', addressController.deleteAddress);

/**
 * @swagger
 * /api/addresses/user/{userId}:
 *   post:
 *     summary: Agregar una dirección a un usuario
 *     tags: [Direcciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               - address
 *             properties:
 *               alias:
 *                 type: string
 *               address:
 *                 type: string
 *               province:
 *                 type: string
 *               city:
 *                 type: string
 *               zip_code:
 *                 type: string
 *               country:
 *                 type: string
 *               observations:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dirección agregada al usuario exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.post('/user/:userId', addressController.addAddressToUser);

/**
 * @swagger
 * /api/addresses/artist/{artistId}:
 *   post:
 *     summary: Agregar una dirección a un artista
 *     tags: [Direcciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: artistId
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
 *               - addressId
 *             properties:
 *               addressId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dirección agregada al artista exitosamente
 *       404:
 *         description: Artista o dirección no encontrados
 */
router.post('/artist/:artistId', addressController.addAddressToArtist);

/**
 * @swagger
 * /api/addresses/user/{userId}/{addressId}:
 *   delete:
 *     summary: Eliminar una dirección de un usuario
 *     tags: [Direcciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dirección eliminada del usuario exitosamente
 *       404:
 *         description: Usuario o dirección no encontrados
 */
router.delete('/user/:userId/:addressId', addressController.removeAddressFromUser);

/**
 * @swagger
 * /api/addresses/artist/{artistId}/{addressId}:
 *   delete:
 *     summary: Eliminar una dirección de un artista
 *     tags: [Direcciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dirección eliminada del artista exitosamente
 *       404:
 *         description: Artista o dirección no encontrados
 */
router.delete('/artist/:artistId/:addressId', addressController.removeAddressFromArtist);

export default router;