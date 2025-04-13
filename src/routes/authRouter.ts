import express, { NextFunction, Request, request, Response, response } from 'express'
import 'dotenv/config'
import { authSignUpController } from '../controllers/auth/authSignUpController'
import { authSignInController } from '../controllers/auth/authSignInController'
import { authTokenMiddleware } from '../middleware/authTokenMiddleware'
import { authSignUpGoogleController } from '../controllers/auth/authSignUpGoogleController'
import { authConfirmOtpController, authSetOtpController } from '../controllers/auth/authOtpController'

export const authRouter = express.Router()

/**
 * @swagger
 * /auth/signup:
 *  post:
 *      tags:
 *          - Autenticación
 *      summary: Registra al usuario en la plataforma
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - name
 *                          - surname
 *                          - username
 *                          - birthDate
 *                          - email
 *                          - password
 *                          - userType
 *                      properties:
 *                          email:
 *                              type: string
 *                              format: email
 *                              description: Correo electrónico
 *                          password:
 *                              type: string
 *                              format: password
 *                              description: Contraseña
 *                          name:
 *                              type: string
 *                              description: Nombre
 *                          surname:
 *                              type: string
 *                              description: Apellidos
 *                          username:
 *                              type: string
 *                              description: Nombre de usuario
 *                          birthDate:
 *                              type: string
 *                              format: date
 *                              description: Fecha de nacimiento
 *                          userType:
 *                              type: string
 *                              enum: [user, artist]
 *                              description: Rol de usuario a registrar
 *                          artistName:
 *                              type: string
 *                              description: Nombre artístico (sólo para rol Artista)
 *                          artistUsername:
 *                              type: string
 *                              description: Nombre de usuario artístico (sólo para rol Artista)
 *      responses:
 *          '200':
 *              description: Usuario registrado con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      token:
 *                                          type: string
 *                                          description: JWT para acceder a la plataforma
 *          '400':
 *              description: Error de cliente
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
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          description: Mensaje de error
 *      security: []
 *              
 */
authRouter.post('/signup', authSignUpController)


authRouter.post('/signin', authTokenMiddleware, authSignInController)
authRouter.post('/signupgoogle', authSignUpGoogleController)

//authRouter.post('/setotp', authSetOtpController)
//authRouter.post('/confirmotp', authConfirmOtpController)