import express from 'express'
import {trendingSongsController} from "../controllers/trending/trendingSongsController";

export const trendingRouter = express.Router()

/**
 * @swagger
 * /trending/songs:
 *  get:
 *      tags:
 *          - Tendencias
 *      summary: Obtiene las canciones más reproducidas
 *      responses:
 *          '200':
 *              description: Obtiene las 10 canciones más reproducidas
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      songs:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              properties:
 *                                                  _id:
 *                                                      type: string
 *                                                      description: ID de la canción
 *                                                  imgUrl:
 *                                                      type: string
 *                                                      description: URL de la portada
 *                                                  title:
 *                                                      type: string
 *                                                      description: Título de la canción
 *                                                  author:
 *                                                      type: object
 *                                                      properties:
 *                                                          _id:
 *                                                              type: string
 *                                                              description: ID del artista
 *                                                          artistName:
 *                                                              type: string
 *                                                              description: Nombre del artista
 *          '500':
 *              description: Error del servidor al obtener las canciones en tendencia
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
trendingRouter.get('/songs', trendingSongsController)