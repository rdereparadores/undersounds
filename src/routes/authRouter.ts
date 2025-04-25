import express, { NextFunction, Request, request, Response, response } from 'express'
import 'dotenv/config'
import { authSignUpController } from '../controllers/auth/authSignUpController'
import { authSignInController } from '../controllers/auth/authSignInController'
import { authTokenMiddleware } from '../middleware/authTokenMiddleware'
import { authSignUpGoogleController } from '../controllers/auth/authSignUpGoogleController'

export const authRouter = express.Router()

/**
 * @swagger
 * /auth/signup:
 *  post:
 *      tags:
 *          - Autenticación
 *      summary: Registra al usuario en la plataforma mediante correo electrónico y contraseña
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
 *              description: Usuario registrado con éxito usando correo electrónico y contraseña
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

/**
 * @swagger
 * /auth/signin:
 *  post:
 *      tags:
 *          - Autenticación
 *      summary: Inicia sesión a un usuario ya existente en la plataforma mediante correo electrónico y contraseña
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - email
 *                          - password
 *                      properties:
 *                          email:
 *                              type: string
 *                              format: email
 *                              description: Correo electrónico
 *                          password:
 *                              type: string
 *                              format: password
 *                              description: Contraseña
 *      responses:
 *          '200':
 *              description: Usuario ha iniciado sesión con éxito usando correo electrónico y contraseña
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      userRole:
 *                                          type: string
 *                                          description: Tipo de usuario para acceder a su respectivo panel
 *          '401':
 *              description: Error cliente no autorizado
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
 *          '500':
 *              description: Error interno del servidor
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
authRouter.post('/signin', authTokenMiddleware, authSignInController)

/**
 * @swagger
 * /auth/signupgoogle:
 *  post:
 *      tags:
 *          - Autenticación
 *      summary: Registra a un usuario en la plataforma usando una cuenta de Google
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - userType
 *                          - idToken
 *                          - email
 *                          - img_url
 *                          - name
 *                      properties:
 *                          userType:
 *                              type: string
 *                              enum: [user, artist]
 *                              description: Rol de usuario a registrar
 *                          idToken:
 *                              type: string
 *                              description: Token del usuario codificado
 *                          email:
 *                              type: string
 *                              format: email
 *                              description: Correo electrónico
 *                          img_url:
 *                              type: string
 *                              format: image
 *                              description: Enlace con la imagen del usuario
 *                          name:
 *                              type: string
 *                              description: Nombre
 *      responses:
 *          '200':
 *              description: Usuario registrado con éxito usando una cuenta de Google
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
authRouter.post('/signupgoogle', authSignUpGoogleController)