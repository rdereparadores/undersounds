import express from 'express'
import { genreAllController } from '../controllers/genre/genreAllController'

export const genreRouter = express.Router()

/**
 * @swagger
 * /genre/all:
 *   get:
 *     tags:
 *       - Géneros
 *     summary: Obtener todos los géneros
 *     description: Se devuelven todos los géneros musicales disponibles. No requiere autenticación.
 *     responses:
 *       '200':
 *         description: Se devuelven todos los géneros disponibles.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     genres:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Lista de géneros musicales
 *       '500':
 *         description: Error obteniendo la información de la base de datos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: number
 *                       example: 2000
 *                       description: Código de error genérico
 *                     message:
 *                       type: string
 *                       example: "Error obteniendo la información de la base de datos"
 *                       description: Mensaje de error
 *     security: []
 */
genreRouter.get('/all', genreAllController)