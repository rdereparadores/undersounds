import express from 'express'
import { songInfoController } from '../controllers/song/songInfoController'
import { songPlayController } from '../controllers/song/songPlayController'
import { authTokenMiddleware } from '../middleware/authTokenMiddleware'

export const songRouter = express.Router()

/**
 * @swagger
 * /api/song/info:
 *   post:
 *     tags:
 *       - Canciones
 *     summary: Consigue toda la información de una canción por su id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - songId
 *             properties:
 *               songId:
 *                 type: string
 *                 description: ID de la canción
 *     responses:
 *       '200':
 *         description: Información de la canción obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     song:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         releaseDate:
 *                           type: string
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
 *                         plays:
 *                           type: number
 *                         collaborators:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               artistName:
 *                                 type: string
 *                               artistImgUrl:
 *                                 type: string
 *                               artistUsername:
 *                                 type: string
 *                               followers:
 *                                 type: number
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                     message:
 *                       type: string
 *             examples:
 *               DatosFaltantes:
 *                 value:
 *                   error:
 *                     code: 3000
 *                     message: "Datos necesarios no proporcionados"
 *               DatosInvalidos:
 *                 value:
 *                   error:
 *                     code: 3001
 *                     message: "Datos proporcionados no válidos"
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
 *                       type: integer
 *                       example: 2000
 *                     message:
 *                       type: string
 *                       example: "Error obteniendo la información de la base de datos"
 *     security: []
 */

songRouter.post('/info', songInfoController)

/**
 * @swagger
 * /api/song/play/{songId}:
 *   get:
 *     tags:
 *       - Canciones
 *     summary: Reproduce una canción
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la canción
 *     responses:
 *       '200':
 *         description: Devuelve el fichero de audio solicitado
 *         content:
 *           audio/mpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       '401':
 *         description: Error de autenticación o autorización
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                     message:
 *                       type: string
 *             examples:
 *               TokenMissing:
 *                 value:
 *                   error:
 *                     code: 1000
 *                     message: "Token de usuario no proporcionado"
 *               TokenInvalid:
 *                 value:
 *                   error:
 *                     code: 1002
 *                     message: "Token de usuario no válido o expirado"
 *               SinAcceso:
 *                 value:
 *                   error:
 *                     code: 1003
 *                     message: "Usuario sin acceso al recurso"
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
 *                       type: integer
 *                       example: 2000
 *                     message:
 *                       type: string
 *     security:
 *       - bearerAuth: []
 */

songRouter.get('/play/:songId', authTokenMiddleware, songPlayController)
