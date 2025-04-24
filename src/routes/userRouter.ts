import express from 'express'
import { userIsFollowingController } from '../controllers/user/userIsFollowingController'
import { userLibrarySongsController } from '../controllers/user/userLibrarySongsController'
import { userLibraryAlbumsController } from '../controllers/user/userLibraryAlbumsController'
import { userOrdersController } from '../controllers/user/userOrdersController'
import { userProfileAddressAddController } from '../controllers/user/userProfileAddressAddController'
import { userProfileAddressSetDefaultController } from '../controllers/user/userProfileAddressSetDefaultController'
import { userProfileController } from '../controllers/user/userProfileController'
import { userProfileUpdateController } from '../controllers/user/userProfileUpdateController'
import { userProfileUpdateImageController } from '../controllers/user/userProfileUpdateImageController'
import { userProfileAddressController } from '../controllers/user/userProfileAddressController'
import { userProfileAddressRemoveController } from '../controllers/user/userProfileAddressRemoveController'
import { userStatsController } from "../controllers/user/userStatsController";
import { userFeaturedArtistsController } from "../controllers/user/userFeaturedArtistsController"
import { userEmailUpdateController } from "../controllers/user/userEmailUpdateController"
import { userPasswordResetController } from "../controllers/user/userPasswordUpdateController"
import { userFeaturedContentController } from '../controllers/user/userFeaturedContentController'
import { userFollowController } from '../controllers/user/userFollowController'
import { userUnfollowController } from '../controllers/user/userUnfollowController'
import { userFollowingController } from '../controllers/user/userFollowingController'

export const userRouter = express.Router()


// REVISADAS

/**
 * @swagger
 * /user/profile:
 *   get:
 *     tags:
 *       - Usuario
 *     summary: Perfil de usuario
 *     description: Devuelve el perfil del usuario autenticado.
 *     responses:
 *       '200':
 *         description: Devuelve el perfil del usuario autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Nombre del usuario
 *                     surname:
 *                       type: string
 *                       description: Apellidos del usuario
 *                     birthDate:
 *                       type: string
 *                       format: date
 *                       description: Fecha de nacimiento en formato ISO (YYYY-MM-DD)
 *                     username:
 *                       type: string
 *                       description: Nombre de usuario
 *                     email:
 *                       type: string
 *                       description: Correo electrónico
 *                     imgUrl:
 *                       type: string
 *                       description: URL de la imagen de perfil
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
userRouter.get('/profile', userProfileController)

/**
 * @swagger
 * /user/profile/address:
 *   get:
 *     tags:
 *       - Usuario
 *     summary: Devuelve las direcciones de un usuario
 *     description: Obtiene todas las direcciones del usuario autenticado.
 *     responses:
 *       '200':
 *         description: Direcciones obtenidas con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID de la dirección
 *                       alias:
 *                         type: string
 *                         description: Alias de la dirección
 *                       name:
 *                         type: string
 *                         description: Nombre del destinatario
 *                       surname:
 *                         type: string
 *                         description: Apellidos del destinatario
 *                       phone:
 *                         type: number
 *                         description: Teléfono de contacto
 *                       address:
 *                         type: string
 *                         description: Dirección principal
 *                       address2:
 *                         type: string
 *                         description: Información adicional de la dirección
 *                       province:
 *                         type: string
 *                         description: Provincia
 *                       city:
 *                         type: string
 *                         description: Ciudad
 *                       zipCode:
 *                         type: number
 *                         description: Código postal
 *                       country:
 *                         type: string
 *                         description: País
 *                       observations:
 *                         type: string
 *                         description: Observaciones adicionales
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
userRouter.get('/profile/address', userProfileAddressController)

/**
 * @swagger
 * /user/profile/update:
 *   post:
 *     tags:
 *       - Usuario
 *     summary: Actualización de datos de usuario
 *     description: Actualiza nombre, apellidos y fecha de nacimiento del usuario autenticado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - surname
 *               - birthDate
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *               surname:
 *                 type: string
 *                 description: Apellidos del usuario
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de nacimiento en formato ISO (YYYY-MM-DD)
 *     responses:
 *       '200':
 *         description: Datos actualizados.
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
userRouter.post('/profile/update', userProfileUpdateController)

/**
 * @swagger
 * /user/profile/update/image:
 *   post:
 *     tags:
 *       - Usuario
 *     summary: Actualización de la imagen de usuario
 *     description: Actualiza la foto de perfil del usuario autenticado.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profileImage
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil (image/jpeg, image/png o image/jpg)
 *     responses:
 *       '200':
 *         description: Actualiza la foto de perfil del usuario.
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
 *         description: Datos necesarios no proporcionados o error en la subida del archivo.
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
 *                         - 3000
 *                         - 3002
 *                       description: 3000=datos necesarios no proporcionados; 3002=error en la subida del archivo
 *                     message:
 *                       type: string
 *                       description: Mensaje de error correspondiente
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
userRouter.post('/profile/update/image', userProfileUpdateImageController)

/**
 * @swagger
 * /user/profile/address/add:
 *   post:
 *     tags:
 *       - Usuario
 *     summary: Añadir dirección
 *     description: Añade una nueva dirección al perfil del usuario autenticado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - alias
 *               - name
 *               - surname
 *               - phone
 *               - address
 *               - province
 *               - city
 *               - zipCode
 *               - country
 *             properties:
 *               alias:
 *                 type: string
 *                 description: Alias de la dirección
 *               name:
 *                 type: string
 *                 description: Nombre del destinatario
 *               surname:
 *                 type: string
 *                 description: Apellidos del destinatario
 *               phone:
 *                 type: number
 *                 description: Teléfono de contacto
 *               address:
 *                 type: string
 *                 description: Dirección principal
 *               address2:
 *                 type: string
 *                 description: Información adicional de la dirección
 *               province:
 *                 type: string
 *                 description: Provincia
 *               city:
 *                 type: string
 *                 description: Ciudad
 *               zipCode:
 *                 type: number
 *                 description: Código postal
 *               country:
 *                 type: string
 *                 description: País
 *               observations:
 *                 type: string
 *                 description: Observaciones u comentarios adicionales
 *     responses:
 *       '200':
 *         description: Dirección añadida.
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
 *         description: Datos necesarios no proporcionados.
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
 *                       example: 3000
 *                     message:
 *                       type: string
 *                       example: "Datos necesarios no proporcionados"
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
 *                       description: 1000=token no proporcionado, 1002=token inválido o expirado
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
 *                     message:
 *                       type: string
 *                       example: "Error obteniendo la información de la base de datos"
 *     security:
 *       - bearerAuth: []
 */
userRouter.post('/profile/address/add', userProfileAddressAddController)

/**
 * @swagger
 * /user/profile/address/remove:
 *   post:
 *     tags:
 *       - Usuario
 *     summary: Eliminar dirección
 *     description: Elimina una dirección del usuario autenticado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressId
 *             properties:
 *               addressId:
 *                 type: string
 *                 description: ID de la dirección a eliminar
 *     responses:
 *       '200':
 *         description: Dirección eliminada.
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
 *         description: Datos necesarios no proporcionados.
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
 *                       example: 3000
 *                     message:
 *                       type: string
 *                       example: "Datos necesarios no proporcionados"
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
 *                       description: 1000=token no proporcionado, 1002=token inválido o expirado
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
 *                     message:
 *                       type: string
 *                       example: "Error obteniendo la información de la base de datos"
 *     security:
 *       - bearerAuth: []
 */
userRouter.post('/profile/address/remove', userProfileAddressRemoveController)

/**
 * @swagger
 * /user/is-following:
 *   post:
 *     tags:
 *       - Usuario
 *     summary: Comprueba si un usuario sigue a un artista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - artistUsername
 *             properties:
 *               artistUsername:
 *                 type: string
 *                 description: Nombre de usuario del artista
 *     responses:
 *       '200':
 *         description: Devuelve si el usuario sigue al artista o no.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     following:
 *                       type: boolean
 *                       description: Indica si el usuario sigue al artista
 *       '400':
 *         description: Datos necesarios no proporcionados.
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
 *                       example: 3000
 *                       description: Código de error
 *                     message:
 *                       type: string
 *                       example: "Datos necesarios no proporcionados"
 *                       description: Mensaje de error
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
 *                       description: 1000=token no proporcionado, 1002=token inválido o expirado
 *                     message:
 *                       type: string
 *                       description: Mensaje de error correspondiente
 *       '500':
 *         description: Error obteniendo la información de la base de datos
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
userRouter.post('/is-following', userIsFollowingController)

/**
 * @swagger
 * /user/following:
 *   get:
 *     tags:
 *       - Usuario
 *     summary: Recuperar artistas seguidos
 *     description: Obtiene la lista de artistas que el usuario autenticado sigue.
 *     responses:
 *       '200':
 *         description: Artistas seguidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       imgUrl:
 *                         type: string
 *                         description: URL de la imagen del artista
 *                       artistName:
 *                         type: string
 *                         description: Nombre del artista
 *                       artistUsername:
 *                         type: string
 *                         description: Nombre de usuario del artista
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
 *                       description: 1000=token no proporcionado, 1002=token inválido o expirado
 *                     message:
 *                       type: string
 *                       description: Mensaje de error correspondiente
 *       '500':
 *         description: Error obteniendo la información de la base de datos
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
userRouter.get('/following', userFollowingController)

/**
 * @swagger
 * /user/follow:
 *   post:
 *     tags:
 *       - Usuario
 *     summary: Seguir artista
 *     description: Permite al usuario autenticado seguir a un artista dado su nombre de usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - artistUsername
 *             properties:
 *               artistUsername:
 *                 type: string
 *                 description: Nombre de usuario del artista a seguir
 *     responses:
 *       '200':
 *         description: Usuario seguido.
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
 *                       description: 1000=token no proporcionado, 1002=token inválido o expirado
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
userRouter.post('/follow', userFollowController)

/**
 * @swagger
 * /user/unfollow:
 *   post:
 *     tags:
 *       - Usuario
 *     summary: Dejar de seguir a un artista
 *     description: Permite al usuario autenticado dejar de seguir a un artista dado su nombre de usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - artistUsername
 *             properties:
 *               artistUsername:
 *                 type: string
 *                 description: Nombre de usuario del artista a dejar de seguir
 *     responses:
 *       '200':
 *         description: El usuario deja de seguir a un artista.
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
 *                       description: 1000=token no proporcionado, 1002=token inválido o expirado
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
userRouter.post('/unfollow', userUnfollowController)

/**
 * @swagger
 * /user/profile/address/set-default:
 *   patch:
 *     tags:
 *       - Usuario
 *     summary: Establece una dirección dada como predeterminada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressId
 *             properties:
 *               addressId:
 *                 type: string
 *                 description: ID de la dirección a establecer como predeterminada
 *     responses:
 *       '200':
 *         description: Dirección establecida como predeterminada.
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
 *         description: Datos necesarios no proporcionados.
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
 *                       example: 3000
 *                     message:
 *                       type: string
 *                       example: "Datos necesarios no proporcionados"
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
 *                     message:
 *                       type: string
 *                       description: Mensaje de error correspondiente
 *       '500':
 *         description: Error obteniendo la información de la base de datos
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
 *     security:
 *       - bearerAuth: []
 */


/**
 * @swagger
 * /user/featured/content:
 *   get:
 *     tags:
 *       - Usuario
 *     summary: Contenido destacado para el usuario
 *     description: Obtiene el contenido destacado para el usuario. No requiere autenticación.
 *     responses:
 *       '200':
 *         description: Obtiene el contenido destacado para el usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       imgUrl:
 *                         type: string
 *                         description: URL de la imagen del contenido
 *                       title:
 *                         type: string
 *                         description: Título del contenido
 *                       type:
 *                         type: string
 *                         enum:
 *                           - song
 *                           - album
 *                         description: Tipo de contenido
 *                       _id:
 *                         type: string
 *                         description: ID del contenido
 *                       releaseDate:
 *                         type: string
 *                         format: date-time
 *                         description: Fecha de lanzamiento
 *                       author:
 *                         type: object
 *                         properties:
 *                           artistUsername:
 *                             type: string
 *                             description: Nombre de usuario del artista
 *                           artistName:
 *                             type: string
 *                             description: Nombre del artista
 *       '500':
 *         description: Error obteniendo la información de la base de datos
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
 *     security: []
 */

userRouter.get('/featured/content', userFeaturedContentController)

/**
 * @swagger
 * /user/featured/artists:
 *   get:
 *     tags:
 *       - Usuario
 *     summary: Artistas destacados para el usuario
 *     description: Obtiene los artistas destacados para el usuario autenticado.
 *     responses:
 *       '200':
 *         description: Artistas destacados obtenidos con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       imgUrl:
 *                         type: string
 *                         description: URL de la imagen del artista
 *                       artistUsername:
 *                         type: string
 *                         description: Nombre de usuario del artista
 *                       artistName:
 *                         type: string
 *                         description: Nombre del artista
 *       '401':
 *         description: Token de usuario no proporcionado o inválido/expirado
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
 *                       description: 1000=token no proporcionado, 1002=token inválido o expirado
 *                     message:
 *                       type: string
 *                       description: Mensaje de error correspondiente
 *       '500':
 *         description: Error obteniendo la información de la base de datos
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
userRouter.get('/featured/artists', userFeaturedArtistsController)

/**
 * @swagger
 * /user/library/songs:
 *   get:
 *     tags:
 *       - Usuario
 *     summary: Canciones de la librería del usuario
 *     description: Obtiene las canciones añadidas por el usuario a su biblioteca digital, incluyendo detalles de duración y colaboradores.
 *     responses:
 *       '200':
 *         description: Canciones obtenidas con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID de la canción
 *                       imgUrl:
 *                         type: string
 *                         description: URL de la portada de la canción
 *                       title:
 *                         type: string
 *                         description: Título de la canción
 *                       duration:
 *                         type: number
 *                         description: Duración de la canción en segundos
 *                       author:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: ID del artista
 *                           artistName:
 *                             type: string
 *                             description: Nombre del artista
 *                       collaborators:
 *                         type: array
 *                         description: Lista de colaboradores aceptados en la canción
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               description: ID del artista colaborador
 *                             artistName:
 *                               type: string
 *                               description: Nombre del artista colaborador
 *       '401':
 *         description: No autorizado (token faltante, inválido o expirado)
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
 *                       description: 1000=token no proporcionado, 1002=token inválido o expirado
 *                     message:
 *                       type: string
 *                       description: Mensaje de error correspondiente
 *       '500':
 *         description: Error obteniendo la información de la base de datos
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
userRouter.get('/library/songs', userLibrarySongsController)

/**
 * @swagger
 * /user/library/albums:
 *   get:
 *     tags:
 *       - Usuario
 *     summary: Álbumes de la librería digital del usuario
 *     description: Obtiene los álbumes añadidos por el usuario a su biblioteca digital, incluyendo detalles de pistas y colaboradores.
 *     responses:
 *       '200':
 *         description: Álbumes obtenidos con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID del álbum
 *                       imgUrl:
 *                         type: string
 *                         description: URL de la portada del álbum
 *                       title:
 *                         type: string
 *                         description: Título del álbum
 *                       duration:
 *                         type: number
 *                         description: Duración total del álbum en segundos
 *                       author:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: ID del artista
 *                           artistName:
 *                             type: string
 *                             description: Nombre del artista
 *                       trackList:
 *                         type: array
 *                         description: Lista de pistas del álbum
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               description: ID de la pista
 *                             imgUrl:
 *                               type: string
 *                               description: URL de la portada de la pista
 *                             title:
 *                               type: string
 *                               description: Título de la pista
 *                             duration:
 *                               type: number
 *                               description: Duración de la pista en segundos
 *                             author:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   description: ID del artista de la pista
 *                                 artistName:
 *                                   type: string
 *                                   description: Nombre del artista de la pista
 *                             collaborators:
 *                               type: array
 *                               description: Colaboradores de la pista
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   _id:
 *                                     type: string
 *                                     description: ID del artista colaborador
 *                                   artistName:
 *                                     type: string
 *                                     description: Nombre del artista colaborador
 *       '401':
 *         description: No autorizado (token faltante, inválido o expirado)
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
 *                       description: 1000=token no proporcionado, 1002=token inválido o expirado
 *                     message:
 *                       type: string
 *                       description: Mensaje de error correspondiente
 *       '500':
 *         description: Error obteniendo la información de la base de datos
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
userRouter.get('/library/albums', userLibraryAlbumsController)

/**
 * @swagger
 * /user/orders:
 *   get:
 *     tags:
 *       - Usuario
 *     summary: Pedidos de un usuario
 *     responses:
 *       '200':
 *         description: Pedidos obtenidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID del pedido
 *                       paid:
 *                         type: boolean
 *                         description: Indica si el pedido está pagado
 *                       purchaseDate:
 *                         type: string
 *                         description: Fecha de compra
 *                       totalPrice:
 *                         type: number
 *                         description: Precio total del pedido
 *                       products:
 *                         type: array
 *                         description: Lista de productos del pedido
 *                         items:
 *                           type: object
 *                           properties:
 *                             imgUrl:
 *                               type: string
 *                               description: URL de la imagen del producto
 *                             title:
 *                               type: string
 *                               description: Título del producto
 *                             author:
 *                               type: string
 *                               description: Autor o artista
 *                             type:
 *                               type: string
 *                               enum:
 *                                 - song
 *                                 - album
 *                               description: Tipo de producto
 *                             format:
 *                               type: string
 *                               enum:
 *                                 - digital
 *                                 - cd
 *                                 - vinyl
 *                                 - cassette
 *                               description: Formato de compra
 *                             price:
 *                               type: number
 *                               description: Precio unitario
 *                             quantity:
 *                               type: number
 *                               description: Cantidad comprada
 *                       address:
 *                         type: object
 *                         description: Datos de envío
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: Nombre del destinatario
 *                           surname:
 *                             type: string
 *                             description: Apellidos del destinatario
 *                           address:
 *                             type: string
 *                             description: Dirección completa
 *                           city:
 *                             type: string
 *                             description: Ciudad
 *                           zipCode:
 *                             type: number
 *                             description: Código postal
 *                           country:
 *                             type: string
 *                             description: País
 *       '401':
 *         description: No autorizado (token faltante, inválido o expirado)
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
 *                       description: 1000=token no proporcionado, 1002=token inválido o expirado
 *                     message:
 *                       type: string
 *                       description: Mensaje de error correspondiente
 *       '500':
 *         description: Error obteniendo la información de la base de datos
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
userRouter.get('/orders', userOrdersController)

/**
 * @swagger
 * /user/stats:
 *   get:
 *     tags:
 *       - Usuario
 *     summary: Obtiene estadísticas agregadas del usuario autenticado
 *     responses:
 *       '200':
 *         description: Obtiene las estadísticas de un usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     listeningTime:
 *                       type: object
 *                       properties:
 *                         thisMonth:
 *                           type: number
 *                           description: Tiempo de escucha en minutos en el mes actual
 *                         pastMonth:
 *                           type: number
 *                           description: Tiempo de escucha en minutos en el mes anterior
 *                     preferredGenre:
 *                       type: object
 *                       properties:
 *                         thisMonth:
 *                           type: string
 *                           description: Género preferido en el mes actual
 *                         pastMonth:
 *                           type: string
 *                           description: Género preferido en el mes anterior
 *                     mostListenedArtist:
 *                       type: object
 *                       properties:
 *                         thisMonth:
 *                           type: object
 *                           properties:
 *                             artistName:
 *                               type: string
 *                               description: Artista más escuchado en el mes actual
 *                             percentage:
 *                               type: number
 *                               description: Porcentaje de reproducciones de ese artista
 *                     topArtists:
 *                       type: array
 *                       description: Top 5 de artistas más reproducidos
 *                       items:
 *                         type: object
 *                         properties:
 *                           artistName:
 *                             type: string
 *                             description: Nombre del artista
 *                           plays:
 *                             type: number
 *                             description: Número de reproducciones
 *                     preferredFormat:
 *                       type: object
 *                       properties:
 *                         format:
 *                           type: string
 *                           description: Formato de audio preferido (digital, cd, vinyl, cassette)
 *                         percentage:
 *                           type: number
 *                           description: Porcentaje de reproducciones en ese formato
 *                     ordersFormat:
 *                       type: object
 *                       properties:
 *                         digital:
 *                           type: number
 *                           description: Cantidad de pedidos en formato digital
 *                         cd:
 *                           type: number
 *                           description: Cantidad de pedidos en formato CD
 *                         vinyl:
 *                           type: number
 *                           description: Cantidad de pedidos en formato vinyl
 *                         cassette:
 *                           type: number
 *                           description: Cantidad de pedidos en formato cassette
 *                     artistBadge:
 *                       type: object
 *                       properties:
 *                         artistName:
 *                           type: string
 *                           description: Artista asignado al badge
 *                         artistImgUrl:
 *                           type: string
 *                           description: URL de la imagen del artista para el badge
 *                         percentile:
 *                           type: number
 *                           description: Percentil de interacción con el artista
 *       '401':
 *         description: Token de usuario no proporcionado.
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
 *                       example: 1000
 *                     message:
 *                       type: string
 *                       example: "Token de usuario no proporcionado"
 *       '401':
 *         description: Token de usuario inválido o expirado.
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
 *                       example: 1002
 *                     message:
 *                       type: string
 *                       example: "Token de usuario no válido o expirado"
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
 *                     message:
 *                       type: string
 *                       example: "Error obteniendo la información de la base de datos"
 *     security:
 *       - bearerAuth: []
 */
userRouter.get('/stats', userStatsController)

// NO REVISADAS

//userRouter.post('/profile/update/email', userEmailUpdateController)
//userRouter.post('/profile/update/password', userPasswordResetController)