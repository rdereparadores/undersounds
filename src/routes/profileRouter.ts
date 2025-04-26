import express from 'express'
import { profileArtistInfoController } from '../controllers/profile/profileArtistInfoController'
import { profileArtistSearchController } from '../controllers/profile/profileArtistSearchController'

export const profileRouter = express.Router()

/**
 * @swagger
 * /api/profile/artist/info:
 *   post:
 *     tags:
 *       - Perfil público
 *     summary: Obtiene el perfil público de un artista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - artistUsername
 *             properties:
 *               artistUsername:
 *                 type: string
 *                 description: Nombre de usuario del artista
 *     responses:
 *       '200':
 *         description: Perfil de artista obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     artistName:
 *                       type: string
 *                     artistUsername:
 *                       type: string
 *                     artistImgUrl:
 *                       type: string
 *                     artistBannerUrl:
 *                       type: string
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
 */
profileRouter.post('/artist/info', profileArtistInfoController)

profileRouter.post('/artist/search', profileArtistSearchController)