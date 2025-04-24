import express from 'express'
import {shopQueryController} from "../controllers/shop/shopQueryController";

export const shopRouter = express.Router()

/**
 * @swagger
 * /shop/query:
 *   post:
 *     tags:
 *       - Tienda
 *     summary: Búsqueda de productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: number
 *                 description: Número de página (por defecto 1)
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Géneros para filtrar
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
 *         description: Productos que cumplen con los filtros especificados
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
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: ID del producto
 *                           imgUrl:
 *                             type: string
 *                             description: URL de la imagen del producto
 *                           title:
 *                             type: string
 *                             description: Título del producto
 *                           author:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 description: ID del artista
 *                               artistName:
 *                                 type: string
 *                                 description: Nombre del artista
 *                           collaborators:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   description: ID del colaborador
 *                                 artistName:
 *                                   type: string
 *                                   description: Nombre del artista colaborador
 *                           type:
 *                             type: string
 *                             enum: [song, album]
 *                             description: Tipo de producto
 *                           genres:
 *                             type: array
 *                             items:
 *                               type: string
 *                             description: Géneros del producto
 *                     totalCount:
 *                       type: number
 *                       description: Total de productos encontrados
 *       '500':
 *         description: Error del servidor
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
 *                       example: "Error obteniendo la información de la base de datos"
 *                       description: Mensaje de error
 *     security: []
 */
shopRouter.post('/query', shopQueryController)