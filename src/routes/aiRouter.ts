import express from 'express'
import { aiImageController } from '../controllers/ai/aiImageController'

export const aiRouter = express.Router()

/**
 * @swagger
 * /api/ai/image:
 *  post:
 *      tags:
 *          - AI
 *      summary: Genera una imagen utilizando inteligencia artificial
 *      description: Genera una imagen utilizando DALL-E 3 basada en un prompt proporcionado.
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - prompt
 *                      properties:
 *                          prompt:
 *                              type: string
 *                              description: Descripción textual para generar la imagen
 *      responses:
 *          '200':
 *              description: Se ha generado una imagen con IA correctamente
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      imgUrl:
 *                                          type: string
 *                                          description: URL de la imagen generada
 *          '400':
 *              description: Prompt no válido o faltante
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      code:
 *                                          type: integer
 *                                          example: 5000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Prompt no válido"
 *                                          description: Mensaje de error
 *          '401':
 *              description: Error de autenticación
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: object
 *                                  properties:
 *                                      code:
 *                                          type: integer
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          description: Mensaje de error
 *                      examples:
 *                          TokenMissing:
 *                              value:
 *                                  error:
 *                                      code: 1000
 *                                      message: "Token de usuario no proporcionado"
 *                          TokenInvalid:
 *                              value:
 *                                  error:
 *                                      code: 1002
 *                                      message: "Token de usuario no válido o expirado"
 */
aiRouter.post('/image', aiImageController)