import express from 'express'
import { songInfoController } from "../controllers/song/songInfoController"
import { songRatingController } from "../controllers/song/songRatingController"

export const songRouter = express.Router()

// REVISADAS

/**
 * @swagger
 * /song/info:
 *  post:
 *      tags:
 *          - Canciones
 *      summary: Obtiene información detallada de una canción
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - songId
 *                      properties:
 *                          songId:
 *                              type: string
 *                              description: ID de la canción
 *      responses:
 *          '200':
 *              description: Información de la canción obtenida con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      song:
 *                                          type: object
 *                                          properties:
 *                                              _id:
 *                                                  type: string
 *                                                  description: ID de la canción
 *                                              title:
 *                                                  type: string
 *                                                  description: Título de la canción
 *                                              description:
 *                                                  type: string
 *                                                  description: Descripción de la canción
 *                                              imgUrl:
 *                                                  type: string
 *                                                  description: URL de la portada
 *                                              author:
 *                                                  type: string
 *                                                  description: ID del autor
 *                                              duration:
 *                                                  type: number
 *                                                  description: Duración en segundos
 *                                              genres:
 *                                                  type: array
 *                                                  items:
 *                                                      type: string
 *                                                  description: IDs de los géneros
 *                                      recommendations:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              properties:
 *                                                  _id:
 *                                                      type: string
 *                                                      description: ID de la canción recomendada
 *                                                  title:
 *                                                      type: string
 *                                                      description: Título de la canción recomendada
 *                                                  imgUrl:
 *                                                      type: string
 *                                                      description: URL de la portada
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
 *      security: []
 */
songRouter.post('/info', songInfoController)

/**
 * @swagger
 * /song/ratings:
 *  post:
 *      tags:
 *          - Canciones
 *      summary: Obtiene las valoraciones de una canción
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - songId
 *                      properties:
 *                          songId:
 *                              type: string
 *                              description: ID de la canción
 *      responses:
 *          '200':
 *              description: Valoraciones obtenidas con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      ratings:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              properties:
 *                                                  _id:
 *                                                      type: string
 *                                                      description: ID de la valoración
 *                                                  rating:
 *                                                      type: number
 *                                                      description: Puntuación (1-5)
 *                                                  title:
 *                                                      type: string
 *                                                      description: Título de la valoración
 *                                                  description:
 *                                                      type: string
 *                                                      description: Comentario de la valoración
 *                                                  author:
 *                                                      type: string
 *                                                      description: ID del autor de la valoración
 *                                                  publishDate:
 *                                                      type: string
 *                                                      format: date
 *                                                      description: Fecha de publicación
 *                                      averageRating:
 *                                          type: number
 *                                          description: Puntuación media
 *                                      totalRatings:
 *                                          type: number
 *                                          description: Número total de valoraciones
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
 *      security: []
 */
songRouter.post('/ratings', songRatingController)