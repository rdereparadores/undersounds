import express from 'express'
import { artistProfileController } from '../controllers/artist/artistProfileController'
import { artistProfileUpdateController } from '../controllers/artist/artistProfileUpdateController'
import {artistStatsController} from "../controllers/artist/artistStatsController";
import { artistProfileUpdateProfileImageController } from '../controllers/artist/artistProfileUpdateProfileImageController';
import { artistProfileUpdateBannerImageController } from '../controllers/artist/artistProfileUpdateBannerImageController';
import { artistReleaseSongController } from '../controllers/artist/artistReleaseSongController';
import { artistSongsController } from '../controllers/artist/artistSongsController'
import { artistAlbumsController } from '../controllers/artist/artistAlbumsController';
import { artistReleaseAlbumController } from '../controllers/artist/artistReleaseAlbumController';

export const artistRouter = express.Router()

// REVISADAS

/**
 * @swagger
 * /artist/profile:
 *  get:
 *      tags:
 *          - Artista
 *      summary: Obtiene el perfil del artista autenticado
 *      responses:
 *          '200':
 *              description: Perfil del artista obtenido con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      artistName:
 *                                          type: string
 *                                          description: Nombre artístico
 *                                      artistUsername:
 *                                          type: string
 *                                          description: Nombre de usuario del artista
 *                                      artistImgUrl:
 *                                          type: string
 *                                          description: URL de la imagen de perfil
 *                                      artistBannerUrl:
 *                                          type: string
 *                                          description: URL de la imagen de banner
 *          '401':
 *              description: No autorizado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      code:
 *                                          type: number
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      code:
 *                                          type: number
 *                                          example: 2000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Error obteniendo la información de la base de datos"
 *                                          description: Mensaje de error
 *      security:
 *          - bearerAuth: []
 */
artistRouter.get('/profile', artistProfileController)

/**
 * @swagger
 * /artist/songs:
 *  get:
 *      tags:
 *          - Artista
 *      summary: Obtiene las canciones del artista autenticado
 *      responses:
 *          '200':
 *              description: Canciones obtenidas con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          _id:
 *                                              type: string
 *                                              description: ID de la canción
 *                                          title:
 *                                              type: string
 *                                              description: Título de la canción
 *                                          description:
 *                                              type: string
 *                                              description: Descripción de la canción
 *                                          imgUrl:
 *                                              type: string
 *                                              description: URL de la portada
 *                                          releaseDate:
 *                                              type: string
 *                                              format: date
 *                                              description: Fecha de lanzamiento
 *          '401':
 *              description: No autorizado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      code:
 *                                          type: number
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      code:
 *                                          type: number
 *                                          example: 2000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Error obteniendo la información de la base de datos"
 *                                          description: Mensaje de error
 *      security:
 *          - bearerAuth: []
 */
artistRouter.get('/songs', artistSongsController)

/**
 * @swagger
 * /artist/albums:
 *  get:
 *      tags:
 *          - Artista
 *      summary: Obtiene los álbumes del artista autenticado
 *      responses:
 *          '200':
 *              description: Álbumes obtenidos con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          _id:
 *                                              type: string
 *                                              description: ID del álbum
 *                                          title:
 *                                              type: string
 *                                              description: Título del álbum
 *                                          description:
 *                                              type: string
 *                                              description: Descripción del álbum
 *                                          imgUrl:
 *                                              type: string
 *                                              description: URL de la portada
 *                                          releaseDate:
 *                                              type: string
 *                                              format: date
 *                                              description: Fecha de lanzamiento
 *          '401':
 *              description: No autorizado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      code:
 *                                          type: number
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      code:
 *                                          type: number
 *                                          example: 2000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Error obteniendo la información de la base de datos"
 *                                          description: Mensaje de error
 *      security:
 *          - bearerAuth: []
 */
artistRouter.get('/albums', artistAlbumsController)

/**
 * @swagger
 * /artist/profile/update:
 *  post:
 *      tags:
 *          - Artista
 *      summary: Actualiza la información del perfil del artista
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          artistName:
 *                              type: string
 *                              description: Nombre artístico
 *                          artistUsername:
 *                              type: string
 *                              description: Nombre de usuario del artista
 *      responses:
 *          '200':
 *              description: Perfil actualizado con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: "OK"
 *          '401':
 *              description: No autorizado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      code:
 *                                          type: number
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      code:
 *                                          type: number
 *                                          example: 2000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Error obteniendo la información de la base de datos"
 *                                          description: Mensaje de error
 *      security:
 *          - bearerAuth: []
 */
artistRouter.post('/profile/update', artistProfileUpdateController)

/**
 * @swagger
 * /artist/profile/update/profileImage:
 *  post:
 *      tags:
 *          - Artista
 *      summary: Actualiza la imagen de perfil del artista
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          artistProfileImg:
 *                              type: string
 *                              format: binary
 *                              description: Imagen de perfil
 *      responses:
 *          '200':
 *              description: Imagen de perfil actualizada con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: "OK"
 *          '400':
 *              description: Error en la solicitud
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      code:
 *                                          type: number
 *                                          example: 3000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Datos necesarios no proporcionados"
 *                                          description: Mensaje de error
 *          '401':
 *              description: No autorizado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      code:
 *                                          type: number
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      code:
 *                                          type: number
 *                                          example: 2000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Error obteniendo la información de la base de datos"
 *                                          description: Mensaje de error
 *      security:
 *          - bearerAuth: []
 */
artistRouter.post('/profile/update/profileImage', artistProfileUpdateProfileImageController)

/**
 * @swagger
 * /artist/profile/update/bannerImage:
 *  post:
 *      tags:
 *          - Artista
 *      summary: Actualiza la imagen de banner del artista
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          artistBannerImg:
 *                              type: string
 *                              format: binary
 *                              description: Imagen de banner
 *      responses:
 *          '200':
 *              description: Imagen de banner actualizada con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: "OK"
 *          '400':
 *              description: Error en la solicitud
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      code:
 *                                          type: number
 *                                          example: 3000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Datos necesarios no proporcionados"
 *                                          description: Mensaje de error
 *          '401':
 *              description: No autorizado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      code:
 *                                          type: number
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      code:
 *                                          type: number
 *                                          example: 2000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Error obteniendo la información de la base de datos"
 *                                          description: Mensaje de error
 *      security:
 *          - bearerAuth: []
 */
artistRouter.post('/profile/update/bannerImage', artistProfileUpdateBannerImageController)

/**
 * @swagger
 * /artist/release/song:
 *  post:
 *      tags:
 *          - Artista
 *      summary: Publica una nueva canción
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - title
 *                          - description
 *                          - priceDigital
 *                          - priceCd
 *                          - priceVinyl
 *                          - priceCassette
 *                          - genres
 *                          - img
 *                          - song
 *                      properties:
 *                          title:
 *                              type: string
 *                              description: Título de la canción
 *                          description:
 *                              type: string
 *                              description: Descripción de la canción
 *                          priceDigital:
 *                              type: number
 *                              description: Precio en formato digital
 *                          priceCd:
 *                              type: number
 *                              description: Precio en formato CD
 *                          priceVinyl:
 *                              type: number
 *                              description: Precio en formato vinilo
 *                          priceCassette:
 *                              type: number
 *                              description: Precio en formato cassette
 *                          genres:
 *                              type: string
 *                              description: Géneros separados por comas
 *                          collaborators:
 *                              type: string
 *                              description: Colaboradores separados por comas
 *                          img:
 *                              type: string
 *                              format: binary
 *                              description: Imagen de portada
 *                          song:
 *                              type: string
 *                              format: binary
 *                              description: Archivo de audio
 *      responses:
 *          '200':
 *              description: Canción publicada con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      id:
 *                                          type: string
 *                                          description: ID de la canción creada
 *          '400':
 *              description: Error en la solicitud
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      code:
 *                                          type: number
 *                                          example: 3000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Datos necesarios no proporcionados"
 *                                          description: Mensaje de error
 *          '401':
 *              description: No autorizado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      code:
 *                                          type: number
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      code:
 *                                          type: number
 *                                          example: 2000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Error obteniendo la información de la base de datos"
 *                                          description: Mensaje de error
 *      security:
 *          - bearerAuth: []
 */
artistRouter.post('/release/song', artistReleaseSongController)

/**
 * @swagger
 * /artist/release/album:
 *   post:
 *     tags:
 *       - Artista
 *     summary: Publica un nuevo álbum
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - priceDigital
 *               - priceCd
 *               - priceVinyl
 *               - priceCassette
 *               - songs
 *               - albumImage
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título del álbum
 *               description:
 *                 type: string
 *                 description: Descripción del álbum
 *               priceDigital:
 *                 type: number
 *                 description: Precio en formato digital
 *               priceCd:
 *                 type: number
 *                 description: Precio en formato CD
 *               priceVinyl:
 *                 type: number
 *                 description: Precio en formato vinilo
 *               priceCassette:
 *                 type: number
 *                 description: Precio en formato cassette
 *               songs:
 *                 type: string
 *                 description: IDs de las canciones separadas por comas
 *               albumImage:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de portada del álbum
 *     responses:
 *       '200':
 *         description: Álbum publicado con éxito
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
 *                       description: ID del álbum creado
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
 *                       type: number
 *                       example: 3000
 *                       description: Código de error (datos faltantes o invalidos)
 *                     message:
 *                       type: string
 *                       example: "Datos necesarios no proporcionados"
 *                       description: Mensaje de error
 *       '401':
 *         description: No autorizado
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
 *                       example: 1000
 *                       description: Código de error de autenticación
 *                     message:
 *                       type: string
 *                       example: "Token de usuario no proporcionado"
 *                       description: Mensaje de error
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
 *                       description: Mensaje descriptivo del error
 *     security:
 *       - bearerAuth: []
 */
artistRouter.post('/release/album', artistReleaseAlbumController)

artistRouter.get('/stats', artistStatsController)