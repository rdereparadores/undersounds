import express from 'express'
import { aiImageController } from '../controllers/ai/aiImageController'

export const aiRouter = express.Router()

/**
 * @swagger
 * /ai/image:
 *  post:
 *      tags:
 *          - IA
 *      summary: Genera una imagen usando IA basada en un prompt
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
 *                              description: Texto descriptivo para generar la imagen
 *      responses:
 *          '200':
 *              description: Imagen generada con éxito
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
 *              description: Error en la solicitud del cliente
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
 *                                          example: 5000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Prompt no válido"
 *                                          description: Mensaje de error
 *      security: []
 */
aiRouter.post('/image', aiImageController)