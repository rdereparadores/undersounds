import express from 'express'
import {albumInfoController} from "../controllers/album/albumInfoController"

export const albumRouter = express.Router()

/**
 * @swagger
 * /album/info:
 *   post:
 *     tags:
 *       - Álbum
 *     summary: Obtener toda la información de un álbum
 *     description: Se ha devuelto la información completa del álbum pedido. No requiere autenticación.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - albumId
 *             properties:
 *               albumId:
 *                 type: string
 *                 description: ID del álbum a consultar
 *     responses:
 *       '200':
 *         description: Se ha devuelto la información completa del álbum pedido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     album:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         releaseDate:
 *                           type: string
 *                           format: date-time
 *                         description:
 *                           type: string
 *                         imgUrl:
 *                           type: string
 *                         author:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             artistName:
 *                               type: string
 *                             artistImgUrl:
 *                               type: string
 *                             artistUsername:
 *                               type: string
 *                             followers:
 *                               type: number
 *                         duration:
 *                           type: number
 *                           description: Duración total en segundos
 *                         genres:
 *                           type: array
 *                           items:
 *                             type: string
 *                         pricing:
 *                           type: object
 *                           properties:
 *                             cd:
 *                               type: number
 *                             digital:
 *                               type: number
 *                             cassette:
 *                               type: number
 *                             vinyl:
 *                               type: number
 *                         trackList:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               title:
 *                                 type: string
 *                               duration:
 *                                 type: number
 *                               imgUrl:
 *                                 type: string
 *                               collaborators:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                                   properties:
 *                                     _id:
 *                                       type: string
 *                                     artistName:
 *                                       type: string
 *                                     artistImgUrl:
 *                                       type: string
 *                                     artistUsername:
 *                                       type: string
 *                                     followers:
 *                                       type: number
 *       '400':
 *         description: Datos necesarios no proporcionados.
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
 *                       example: 3000
 *                     message:
 *                       type: string
 *                       example: "Datos necesarios no proporcionados"
 *       '400':
 *         description: Datos proporcionados no válidos.
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
 *                       example: 3001
 *                     message:
 *                       type: string
 *                       example: "Datos proporcionados no válidos"
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
 *                     message:
 *                       type: string
 *                       example: "Error obteniendo la información de la base de datos"
 *     security: []
 */
albumRouter.post('/info', albumInfoController)