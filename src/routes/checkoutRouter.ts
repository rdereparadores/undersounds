import express from 'express'
import { checkoutCreate } from '../controllers/checkout/checkoutCreate'
import { checkoutSuccess } from '../controllers/checkout/checkoutSuccess'

export const checkoutRouter = express.Router()

/**
 * @swagger
 * /api/checkout/order/create:
 *   post:
 *     tags:
 *       - Checkout
 *     summary: Crea un nuevo pedido pendiente de pago
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressId
 *               - cart
 *             properties:
 *               addressId:
 *                 type: string
 *                 description: ID de la dirección de envío
 *               cart:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     format:
 *                       type: string
 *                       enum: [digital, cd, vinyl, cassette]
 *                     quantity:
 *                       type: number
 *                 description: Lista de ítems a comprar
 *     responses:
 *       '200':
 *         description: Pedido creado correctamente, devuelve URL de Stripe para pago
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       description: URL para completar el pago
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                     message:
 *                       type: string
 *             examples:
 *               DatosFaltantes:
 *                 value:
 *                   error:
 *                     code: 3000
 *                     message: "Datos necesarios no proporcionados"
 *       '401':
 *         description: Error de autenticación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                     message:
 *                       type: string
 *             examples:
 *               TokenMissing:
 *                 value:
 *                   error:
 *                     code: 1000
 *                     message: "Token de usuario no proporcionado"
 *               TokenInvalid:
 *                 value:
 *                   error:
 *                     code: 1002
 *                     message: "Token de usuario no válido o expirado"
 *       '500':
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 2000
 *                     message:
 *                       type: string
 *                       example: "Error obteniendo la información de la base de datos"
 */
checkoutRouter.post('/order/create', checkoutCreate)

/**
 * @swagger
 * /api/checkout/order/success:
 *   post:
 *     tags:
 *       - Checkout
 *     summary: Marca un pedido como pagado tras confirmación de Stripe
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: string
 *                 description: ID de sesión de Stripe
 *     responses:
 *       '200':
 *         description: Pago confirmado y pedido marcado como pagado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     paid:
 *                       type: boolean
 *                       description: Estado del pago
 *       '400':
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                     message:
 *                       type: string
 *             examples:
 *               DatosFaltantes:
 *                 value:
 *                   error:
 *                     code: 3000
 *                     message: "Datos necesarios no proporcionados"
 *       '401':
 *         description: Error de autenticación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                     message:
 *                       type: string
 *             examples:
 *               TokenMissing:
 *                 value:
 *                   error:
 *                     code: 1000
 *                     message: "Token de usuario no proporcionado"
 *               TokenInvalid:
 *                 value:
 *                   error:
 *                     code: 1002
 *                     message: "Token de usuario no válido o expirado"
 *       '500':
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: integer
 *                       example: 2000
 *                     message:
 *                       type: string
 *                       example: "Error obteniendo la información de la base de datos"
 */
checkoutRouter.post('/order/success', checkoutSuccess)
