import express from 'express'
import { otpCreateController } from '../controllers/otp/otpCreateController'

export const otpRouter = express.Router()

/**
 * @swagger
 * /otp/create:
 *   get:
 *     tags:
 *       - OTP
 *     summary: Generar un OTP para cambios avanzados
 *     description: Genera un código OTP y lo envía al correo electrónico del usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OTP generado y enviado por correo electrónico.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "OK"
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
 *             examples:
 *               missingToken:
 *                 summary: Token no proporcionado
 *                 value:
 *                   error:
 *                     code: 1000
 *                     message: "Token de usuario no proporcionado"
 *               invalidToken:
 *                 summary: Token inválido o expirado
 *                 value:
 *                   error:
 *                     code: 1002
 *                     message: "Token de usuario inválido o expirado"
 *       '500':
 *         description: Error interno del servidor al generar o enviar OTP.
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
 */
otpRouter.get('/create', otpCreateController)