import express from 'express'
import { genreAllController } from '../controllers/genre/genreAllController'

export const genreRouter = express.Router()

/**
 * @swagger
 * /genre/all:
 *  get:
 *      tags:
 *          - Géneros
 *      summary: Obtiene todos los géneros musicales disponibles
 *      responses:
 *          '200':
 *              description: Lista de géneros obtenida con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      genres:
 *                                          type: array
 *                                          items:
 *                                              type: string
 *                                          description: Lista de géneros musicales
 *          '500':
 *              description: Error del servidor al obtener los géneros
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
genreRouter.get('/all', genreAllController)