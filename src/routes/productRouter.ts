import express from 'express'
import { productRecommendationsController } from '../controllers/product/productRecommendationsController'
import { productRatingsController } from '../controllers/product/productRatingsController'
import { authTokenMiddleware } from '../middleware/authTokenMiddleware'
import { productRatingsAddController } from '../controllers/product/productRatingsAddController'
import { productRatingsRemoveController } from '../controllers/product/productRatingsRemoveController'
import { productRatingsUpdateController } from '../controllers/product/productRatingsUpdateController'
import { productRatingsUserController } from '../controllers/product/productRatingsUserController'

export const productRouter = express.Router()

/**
 * @swagger
 * /api/product/ratings:
 *   post:
 *     tags:
 *       - Producto
 *     summary: Obtiene todas las reseñas de un producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID del producto
 *     responses:
 *       '200':
 *         description: Reseñas obtenidas con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     ratings:
 *                       type: array
 *                       items:
 *                         type: object
 *                     averageRating:
 *                       type: number
 *                     totalRatings:
 *                       type: number
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
 *               DatosInvalidos:
 *                 value:
 *                   error:
 *                     code: 3001
 *                     message: "Datos proporcionados no válidos"
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
productRouter.post('/ratings', productRatingsController)

/**
 * @swagger
 * /api/product/ratings/add:
 *   post:
 *     tags:
 *       - Producto
 *     summary: Publica una reseña para un producto
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - rating
 *               - title
 *               - description
 *             properties:
 *               id:
 *                 type: string
 *               rating:
 *                 type: string
 *                 enum: ['1','2','3','4','5']
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Reseña publicada correctamente
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
 *               DatosInvalidos:
 *                 value:
 *                   error:
 *                     code: 3001
 *                     message: "Datos proporcionados no válidos"
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
 *               SinAcceso:
 *                 value:
 *                   error:
 *                     code: 1003
 *                     message: "Usuario sin acceso al recurso"
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
productRouter.post('/ratings/add', authTokenMiddleware, productRatingsAddController)

/**
 * @swagger
 * /api/product/recommendations:
 *   post:
 *     tags:
 *       - Producto
 *     summary: Obtiene recomendaciones de productos relacionados
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID del producto
 *     responses:
 *       '200':
 *         description: Recomendaciones obtenidas con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
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
productRouter.post('/recommendations', productRecommendationsController)

// Documentación Swagger para los endpoints restantes

/**
 * @swagger
 * /api/product/ratings/remove:
 *   post:
 *     tags:
 *       - Producto
 *     summary: Elimina una reseña de un producto
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ratingId
 *             properties:
 *               ratingId:
 *                 type: string
 *                 description: ID de la reseña a eliminar
 *     responses:
 *       '200':
 *         description: Reseña eliminada exitosamente
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
 *               DatosInvalidos:
 *                 value:
 *                   error:
 *                     code: 3001
 *                     message: "Datos proporcionados no válidos"
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
 *               SinAcceso:
 *                 value:
 *                   error:
 *                     code: 1003
 *                     message: "Usuario sin acceso al recurso"
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
productRouter.post('/ratings/remove', authTokenMiddleware, productRatingsRemoveController)

/**
 * @swagger
 * /api/product/ratings/update:
 *   post:
 *     tags:
 *       - Producto
 *     summary: Actualiza una reseña de producto existente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ratingId
 *             properties:
 *               ratingId:
 *                 type: string
 *                 description: ID de la reseña a actualizar
 *               rating:
 *                 type: string
 *                 enum: ['1','2','3','4','5']
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Reseña actualizada correctamente
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
 *               DatosInvalidos:
 *                 value:
 *                   error:
 *                     code: 3001
 *                     message: "Datos proporcionados no válidos"
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
 *               SinAcceso:
 *                 value:
 *                   error:
 *                     code: 1003
 *                     message: "Usuario sin acceso al recurso"
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
productRouter.post('/ratings/update', authTokenMiddleware, productRatingsUpdateController)

/**
 * @swagger
 * /api/product/ratings/user:
 *   post:
 *     tags:
 *       - Producto
 *     summary: Comprueba la reseña escrita por el usuario para un producto
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID del producto
 *     responses:
 *       '200':
 *         description: Reseña del usuario obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     rating:
 *                       type: object
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
 *               SinAcceso:
 *                 value:
 *                   error:
 *                     code: 1003
 *                     message: "Usuario sin acceso al recurso"
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
productRouter.post('/ratings/user', authTokenMiddleware, productRatingsUserController)