import express from 'express'
import {shopQueryController} from "../controllers/shop/shopQueryController";

export const shopRouter = express.Router()

/**
 * @swagger
 * /shop/query:
 *   post:
 *     tags:
 *       - Tienda
 *     summary: Consulta productos en la tienda con filtros y paginación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: integer
 *                 description: Número de página (por defecto 1)
 *                 example: 1
 *               genres:
 *                 type: string
 *                 description: Géneros separados por comas para filtrar
 *                 example: "rock,pop"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Fecha de lanzamiento para filtrar (YYYY-MM-DD)
 *               sortBy:
 *                 type: string
 *                 description: Campo por el que ordenar (e.g. releaseDate, title, price)
 *               query:
 *                 type: string
 *                 description: Término de búsqueda libre sobre título o descripción
 *     responses:
 *       '200':
 *         description: Resultados de la consulta exitosos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       description: Lista de productos encontrados
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: ID del producto
 *                           title:
 *                             type: string
 *                           releaseDate:
 *                             type: string
 *                             format: date-time
 *                           description:
 *                             type: string
 *                           imgUrl:
 *                             type: string
 *                           version:
 *                             type: number
 *                           productType:
 *                             type: string
 *                             enum:
 *                               - song
 *                               - album
 *                           author:
 *                             type: string
 *                             description: Nombre del artista
 *                           duration:
 *                             type: number
 *                             description: Duración en segundos
 *                           genres:
 *                             type: array
 *                             items:
 *                               type: string
 *                             description: Nombres de géneros asociados
 *                           pricing:
 *                             type: object
 *                             properties:
 *                               cd:
 *                                 type: number
 *                               digital:
 *                                 type: number
 *                               cassette:
 *                                 type: number
 *                               vinyl:
 *                                 type: number
 *                           ratings:
 *                             type: array
 *                             items:
 *                               type: string
 *                             description: IDs de valoraciones
 *                     totalCount:
 *                       type: integer
 *                       description: Total de productos encontrados
 *       '500':
 *         description: Error interno del servidor
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
 *                       description: Código de error interno
 *                     message:
 *                       type: string
 *                       example: "Error interno al procesar la consulta"
 *                       description: Mensaje de error
 *     security: []
 */
shopRouter.post('/query', shopQueryController)