import express from 'express'
import { artistProfileController } from '../controllers/artist/artistProfileController'
import { artistProfileUpdateController } from '../controllers/artist/artistProfileUpdateController'
import { artistStatsController } from '../controllers/artist/artistStatsController'
import { artistProfileUpdateProfileImageController } from '../controllers/artist/artistProfileUpdateProfileImageController'
import { artistProfileUpdateBannerImageController } from '../controllers/artist/artistProfileUpdateBannerImageController'
import { artistReleaseSongController } from '../controllers/artist/artistReleaseSongController'
import { artistSongsController } from '../controllers/artist/artistSongsController'
import { artistAlbumsController } from '../controllers/artist/artistAlbumsController'
import { artistReleaseAlbumController } from '../controllers/artist/artistReleaseAlbumController'
import { artistSongsUpdateController } from '../controllers/artist/artistSongsUpdateController'
import { artistSongsHistoryController } from '../controllers/artist/artistSongsHistoryController'
import { artistAlbumsUpdateController } from '../controllers/artist/artistAlbumsUpdateController'
import { artistAlbumsHistoryController } from '../controllers/artist/artistAlbumsHistoryController'
import { artistTransactionsController } from '../controllers/artist/artistTransitionsController'

export const artistRouter = express.Router()
/**
 * @swagger
 * /artist/profile:
 *   get:
 *     tags:
 *       - Artista
 *     summary: Perfil del artista autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Información del perfil del artista obtenida con éxito
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
 *                       description: Nombre del artista
 *                     artistUsername:
 *                       type: string
 *                       description: Username único del artista
 *                     artistImgUrl:
 *                       type: string
 *                       description: URL de la imagen de perfil
 *                     artistBannerUrl:
 *                       type: string
 *                       description: URL de la imagen de banner
 *       '401':
 *         description: Token de usuario no proporcionado o rol de artista requerido
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
 *               RoleRequired:
 *                 value:
 *                   error:
 *                     code: 1001
 *                     message: "Rol de artista requerido"
 *               TokenInvalid:
 *                 value:
 *                   error:
 *                     code: 1002
 *                     message: " Token de usuario no válido o expirado."
 *       '500':
 *         description: Error obteniendo la información de la base de datos
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
artistRouter.get('/profile', artistProfileController)

/**
 * @swagger
 * /artist/profile/update:
 *   post:
 *     tags:
 *       - Artista
 *     summary: Actualiza datos del perfil del artista
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: []
 *             properties:
 *               artistName?:
 *                 type: string
 *                 description: Nuevo nombre del artista
 *               artistUsername?:
 *                 type: string
 *                 description: Nuevo username del artista
 *     responses:
 *       '200':
 *         description: Perfil actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "OK"
 *       '400':
 *         description: Datos inválidos o mal formateados
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
 *               DatosInvalidos:
 *                 value:
 *                   error:
 *                     code: 3001
 *                     message: "Datos proporcionados no válidos"
 *       '401':
 *         description: Token de usuario no proporcionado o rol no permitido
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
 *               RoleRequired:
 *                 value:
 *                   error:
 *                     code: 1001
 *                     message: "Rol de artista requerido"
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
artistRouter.post('/profile/update', artistProfileUpdateController)

/**
 * @swagger
 * /artist/profile/update/profileImage:
 *   post:
 *     tags:
 *       - Artista
 *     summary: Actualiza la foto de perfil del artista
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               artistProfileImg:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil a subir
 *     responses:
 *       '200':
 *         description: Foto de perfil actualizada con éxito
 *       '400':
 *         description: Datos necesarios no proporcionados o error en la subida
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
 *               UploadError:
 *                 value:
 *                   error:
 *                     code: 3002
 *                     message: "Error en la subida del archivo"
 *       '401':
 *         description: Token de usuario no proporcionado o rol no permitido
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
 *               RoleRequired:
 *                 value:
 *                   error:
 *                     code: 1001
 *                     message: "Rol de artista requerido"
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
artistRouter.post('/profile/update/profileImage', artistProfileUpdateProfileImageController)

/**
 * @swagger
 * /artist/profile/update/bannerImage:
 *   post:
 *     tags:
 *       - Artista
 *     summary: Actualiza el banner del artista
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               artistBannerImg:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de banner a subir
 *     responses:
 *       '200':
 *         description: Banner actualizado con éxito
 *       '400':
 *         description: Datos necesarios no proporcionados o error en la subida
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
 *               UploadError:
 *                 value:
 *                   error:
 *                     code: 3002
 *                     message: "Error en la subida del archivo"
 *       '401':
 *         description: Token de usuario no proporcionado o rol no permitido
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
 *               RoleRequired:
 *                 value:
 *                   error:
 *                     code: 1001
 *                     message: "Rol de artista requerido"
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
artistRouter.post('/profile/update/bannerImage', artistProfileUpdateBannerImageController)

/**
 * @swagger
 * /artist/release/song:
 *   post:
 *     tags:
 *       - Artista
 *     summary: Publica una nueva canción
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - img
 *               - song
 *               - title
 *               - description
 *               - priceDigital
 *               - priceCd
 *             properties:
 *               img:
 *                 type: string
 *                 format: binary
 *               song:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priceDigital:
 *                 type: number
 *               priceCd:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Canción publicada exitosamente, retorna ID de la canción
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *       '401':
 *         description: Token de usuario no proporcionado o rol no permitido
 *       '500':
 *         description: Error del servidor
 */
artistRouter.post('/release/song', artistReleaseSongController)

/**
 * @swagger
 * /artist/songs:
 *   get:
 *     tags:
 *       - Artista
 *     summary: Obtiene la lista de canciones del artista
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de canciones obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       '401':
 *         description: Token de usuario no proporcionado o rol no permitido
 *       '500':
 *         description: Error del servidor
 */
artistRouter.get('/songs', artistSongsController)

/**
 * @swagger
 * /artist/songs/history:
 *   post:
 *     tags:
 *       - Artista
 *     summary: Recupera el historial de versiones de una canción
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       '200':
 *         description: Historial recuperado con éxito
 *       '401':
 *         description: Token de usuario no proporcionado o rol no permitido
 *       '500':
 *         description: Error del servidor
 */
artistRouter.post('/songs/history', artistSongsHistoryController)

/**
 * @swagger
 * /artist/songs/update:
 *   post:
 *     tags:
 *       - Artista
 *     summary: Actualiza una canción existente y guarda versión anterior en el historial
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - songId
 *             properties:
 *               songId:
 *                 type: string
 *               title?:
 *                 type: string
 *               description?:
 *                 type: string
 *               priceDigital?:
 *                 type: number
 *               priceCd?:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Canción actualizada con éxito
 *       '401':
 *         description: Token de usuario no proporcionado o rol no permitido
 *       '500':
 *         description: Error del servidor
 */
artistRouter.post('/songs/update', artistSongsUpdateController)

/**
 * @swagger
 * /artist/release/album:
 *   post:
 *     tags:
 *       - Artista
 *     summary: Publica un nuevo álbum
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - albumImage
 *               - title
 *               - songs
 *             properties:
 *               albumImage:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description?:
 *                 type: string
 *               songs:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Álbum publicado con éxito, retorna ID de álbum
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *       '401':
 *         description: Token de usuario no proporcionado o rol no permitido
 *       '500':
 *         description: Error del servidor
 */
artistRouter.post('/release/album', artistReleaseAlbumController)

/**
 * @swagger
 * /artist/albums:
 *   get:
 *     tags:
 *       - Artista
 *     summary: Obtiene la lista de álbumes del artista
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Álbumes obtenidos con éxito
 *       '401':
 *         description: Token de usuario no proporcionado o rol no permitido
 *       '500':
 *         description: Error del servidor
 */
artistRouter.get('/albums', artistAlbumsController)

/**
 * @swagger
 * /artist/albums/history:
 *   post:
 *     tags:
 *       - Artista
 *     summary: Recupera el historial de versiones de un álbum
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       '200':
 *         description: Historial recuperado con éxito
 *       '401':
 *         description: Token de usuario no proporcionado o rol no permitido
 *       '500':
 *         description: Error del servidor
 */
artistRouter.post('/albums/history', artistAlbumsHistoryController)

/**
 * @swagger
 * /artist/albums/update:
 *   post:
 *     tags:
 *       - Artista
 *     summary: Actualiza un álbum existente y guarda versión anterior en el historial
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - albumId
 *             properties:
 *               albumId:
 *                 type: string
 *               title?:
 *                 type: string
 *               songs?:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Álbum actualizado con éxito
 *       '401':
 *         description: Token de usuario no proporcionado o rol no permitido
 *       '500':
 *         description: Error del servidor
 */
artistRouter.post('/albums/update', artistAlbumsUpdateController)

/**
 * @swagger
 * /artist/stats:
 *   get:
 *     tags:
 *       - Artista
 *     summary: Obtiene estadísticas del artista
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Estadísticas obtenidas con éxito
 *       '401':
 *         description: Token de usuario no proporcionado o rol no permitido
 *       '500':
 *         description: Error del servidor
 */
artistRouter.get('/stats', artistStatsController)

/**
 * @swagger
 * /artist/transitions:
 *   get:
 *     tags:
 *       - Artista
 *     summary: Obtiene ventas/transacciones del artista
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Transacciones obtenidas con éxito
 *       '401':
 *         description: Token de usuario no proporcionado o rol no permitido
 *       '500':
 *         description: Error del servidor
 */
artistRouter.get('/transitions', artistTransactionsController)