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
 * /api/auth/signup:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Registro de usuario
 *     description: Registra un usuario con correo electrónico y contraseña. Devuelve un JWT para la sesión.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - surname
 *               - username
 *               - birthDate
 *               - email
 *               - password
 *               - userType
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               surname:
 *                 type: string
 *                 description: Apellidos del usuario
 *               username:
 *                 type: string
 *                 description: Nombre de usuario
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de nacimiento (YYYY-MM-DD)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña
 *               userType:
 *                 type: string
 *                 enum:
 *                   - user
 *                   - artist
 *                 description: Rol de usuario
 *               artistName:
 *                 type: string
 *                 description: Nombre artístico (solo para artistas)
 *               artistUsername:
 *                 type: string
 *                 description: Nombre de usuario artístico (solo para artistas)
 *     responses:
 *       '200':
 *         description: Usuario registrado correctamente. Se devuelve el token de sesión.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT para acceder a la plataforma
 *       '400':
 *         description: Errores en los datos de entrada.
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
 *                     message:
 *                       type: string
 *             examples:
 *               missingFields:
 *                 summary: Campos faltantes
 *                 value:
 *                   error:
 *                     code: 3000
 *                     message: "Datos necesarios no proporcionados"
 *               emailRegistered:
 *                 summary: Email ya registrado
 *                 value:
 *                   error:
 *                     code: 4001
 *                     message: "El correo electrónico ya está registrado."
 *               invalidEmail:
 *                 summary: Email inválido
 *                 value:
 *                   error:
 *                     code: 4002
 *                     message: "El correo electrónico proporcionado no es válido"
 *       '500':
 *         description: Error interno del servidor al obtener datos de la base.
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
 *                     message:
 *                       type: string
 *             example:
 *               error:
 *                 code: 2000
 *                 message: "Error obteniendo la información de la base de datos"
 *     security: []
 */
authRouter.post('/signup', authSignUpController);



/**
 * @swagger
 * /auth/signin:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Inicio de sesión
 *     description: Inicia sesión y devuelve el rol de usuario. Requiere autenticación previa con token.
 *     responses:
 *       '200':
 *         description: Inicio de sesión correcto. Se proporciona el rol de usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     userType:
 *                       type: string
 *                       enum:
 *                         - user
 *                         - artist
 *                       description: Rol de usuario para acceder a su respectivo panel
 *       '401':
 *         description: Token de usuario no proporcionado o inválido/expirado.
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
 *                       enum:
 *                         - 1000
 *                         - 1002
 *                       description: 1000=token no proporcionado; 1002=token inválido o expirado
 *                     message:
 *                       type: string
 *                       description: Mensaje de error correspondiente
 *       '500':
 *         description: Error obteniendo la información de la base de datos.
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
 *                       description: Código de error genérico
 *                     message:
 *                       type: string
 *                       example: "Error obteniendo la información de la base de datos"
 *                       description: Mensaje de error
 *     security:
 *       - bearerAuth: []
 */
authRouter.post('/signin', authTokenMiddleware, authSignInController)

/**
 * @swagger
 * /auth/signupgoogle:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Registro o inicio de sesión con cuenta de Google
 *     description: Permite registrarse o iniciar sesión usando una cuenta de Google y devuelve un JWT para la sesión.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *               - userType
 *               - name
 *               - email
 *               - imgUrl
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Token de Google (ID token)
 *               userType:
 *                 type: string
 *                 enum:
 *                   - user
 *                   - artist
 *                 description: Rol de usuario a registrar
 *               name:
 *                 type: string
 *                 description: Nombre completo del usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico
 *               imgUrl:
 *                 type: string
 *                 description: URL de la imagen de perfil del usuario
 *     responses:
 *       '200':
 *         description: Operación exitosa. Se devuelve el token de sesión.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT para acceder a la plataforma
 *       '400':
 *         description: Errores en los datos de entrada.
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
 *                     message:
 *                       type: string
 *             examples:
 *               missingFields:
 *                 summary: Campos faltantes
 *                 value:
 *                   error:
 *                     code: 3000
 *                     message: "Datos necesarios no proporcionados"
 *               emailRegistered:
 *                 summary: Email ya registrado
 *                 value:
 *                   error:
 *                     code: 4001
 *                     message: "El correo electrónico ya está registrado."
 *               invalidEmail:
 *                 summary: Email inválido
 *                 value:
 *                   error:
 *                     code: 4002
 *                     message: "El correo electrónico proporcionado no es válido"
 *       '500':
 *         description: Error interno del servidor al obtener datos de la base de datos.
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
 *                     message:
 *                       type: string
 *                       example: "Error obteniendo la información de la base de datos"
 *     security: []
 */
authRouter.post('/signupgoogle', authSignUpGoogleController);

//authRouter.post('/setotp', authSetOtpController)
//authRouter.post('/confirmotp', authConfirmOtpController)