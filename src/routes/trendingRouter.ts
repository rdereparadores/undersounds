import express from 'express'
import {trendingSongsController} from "../controllers/trending/trendingSongsController";

export const trendingRouter = express.Router()

/**
 * @swagger
 * /trending/songs:
 *  get:
 *      tags:
 *          - Tendencias
 *      summary: Obtiene las canciones más reproducidas en la plataforma
 *      responses:
 *          '200':
 *              description: Lista de canciones en tendencia obtenida con éxito
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
 *                                                  title:
 *                                                      type: string
 *                                                      description: Título de la canción
 *                                                  imgUrl:
 *                                                      type: string
 *                                                      description: URL de la portada
 *                                                  author:
 *                                                      type: string
 *                                                      description: ID del artista
 *                                                  plays:
 *                                                      type: number
 *                                                      description: Número de reproducciones
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