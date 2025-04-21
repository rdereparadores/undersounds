import express from 'express'
import { userIsFollowingController } from '../controllers/user/userIsFollowingController'
import { userLibrarySongsController } from '../controllers/user/userLibrarySongsController'
import { userLibraryAlbumsController } from '../controllers/user/userLibraryAlbumsController'
import { userOrdersController } from '../controllers/order/userOrdersController'
import { userOrdersOrderController } from '../controllers/order/userOrdersOrderController'
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

export const userRouter = express.Router()


// REVISADAS

/**
 * @swagger
 * /user/profile:
 *  get:
 *      tags:
 *          - Usuario
 *      summary: Obtiene el perfil del usuario autenticado
 *      responses:
 *          '200':
 *              description: Perfil obtenido con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      name:
 *                                          type: string
 *                                          description: Nombre del usuario
 *                                      surname:
 *                                          type: string
 *                                          description: Apellidos del usuario
 *                                      birthDate:
 *                                          type: string
 *                                          format: date
 *                                          description: Fecha de nacimiento
 *                                      username:
 *                                          type: string
 *                                          description: Nombre de usuario
 *                                      email:
 *                                          type: string
 *                                          description: Correo electrónico
 *                                      imgUrl:
 *                                          type: string
 *                                          description: URL de la imagen de perfil
 *          '401':
 *              description: No autorizado
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
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
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
 *      security:
 *          - bearerAuth: []
 */
userRouter.get('/profile', userProfileController)

/**
 * @swagger
 * /user/profile/address:
 *  get:
 *      tags:
 *          - Usuario
 *      summary: Obtiene las direcciones del usuario autenticado
 *      responses:
 *          '200':
 *              description: Direcciones obtenidas con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          _id:
 *                                              type: string
 *                                              description: ID de la dirección
 *                                          alias:
 *                                              type: string
 *                                              description: Alias de la dirección
 *                                          name:
 *                                              type: string
 *                                              description: Nombre del destinatario
 *                                          surname:
 *                                              type: string
 *                                              description: Apellidos del destinatario
 *                                          phone:
 *                                              type: number
 *                                              description: Teléfono de contacto
 *                                          address:
 *                                              type: string
 *                                              description: Dirección
 *                                          address2:
 *                                              type: string
 *                                              description: Información adicional de dirección
 *                                          province:
 *                                              type: string
 *                                              description: Provincia
 *                                          city:
 *                                              type: string
 *                                              description: Ciudad
 *                                          zipCode:
 *                                              type: number
 *                                              description: Código postal
 *                                          country:
 *                                              type: string
 *                                              description: País
 *                                          default:
 *                                              type: boolean
 *                                              description: Indica si es la dirección predeterminada
 *          '401':
 *              description: No autorizado
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
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
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
 *      security:
 *          - bearerAuth: []
 */
userRouter.get('/profile/address', userProfileAddressController)

/**
 * @swagger
 * /user/profile/update:
 *  post:
 *      tags:
 *          - Usuario
 *      summary: Actualiza la información del perfil del usuario
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: Nombre del usuario
 *                          surname:
 *                              type: string
 *                              description: Apellidos del usuario
 *                          birthDate:
 *                              type: string
 *                              format: date
 *                              description: Fecha de nacimiento
 *      responses:
 *          '200':
 *              description: Perfil actualizado con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: "OK"
 *          '401':
 *              description: No autorizado
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
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
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
 *      security:
 *          - bearerAuth: []
 */
userRouter.post('/profile/update', userProfileUpdateController)

/**
 * @swagger
 * /user/profile/update/image:
 *  post:
 *      tags:
 *          - Usuario
 *      summary: Actualiza la imagen de perfil del usuario
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          profileImage:
 *                              type: string
 *                              format: binary
 *                              description: Imagen de perfil
 *      responses:
 *          '200':
 *              description: Imagen de perfil actualizada con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: "OK"
 *          '400':
 *              description: Error en la solicitud
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
 *                                          example: 3000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Datos necesarios no proporcionados"
 *                                          description: Mensaje de error
 *          '401':
 *              description: No autorizado
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
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
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
 *      security:
 *          - bearerAuth: []
 */
userRouter.post('/profile/update/image', userProfileUpdateImageController)

/**
 * @swagger
 * /user/profile/address/add:
 *  post:
 *      tags:
 *          - Usuario
 *      summary: Añade una nueva dirección al usuario
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - address
 *                      properties:
 *                          address:
 *                              type: object
 *                              properties:
 *                                  alias:
 *                                      type: string
 *                                      description: Alias de la dirección
 *                                  name:
 *                                      type: string
 *                                      description: Nombre del destinatario
 *                                  surname:
 *                                      type: string
 *                                      description: Apellidos del destinatario
 *                                  phone:
 *                                      type: number
 *                                      description: Teléfono de contacto
 *                                  address:
 *                                      type: string
 *                                      description: Dirección
 *                                  address2:
 *                                      type: string
 *                                      description: Información adicional de dirección
 *                                  province:
 *                                      type: string
 *                                      description: Provincia
 *                                  city:
 *                                      type: string
 *                                      description: Ciudad
 *                                  zipCode:
 *                                      type: number
 *                                      description: Código postal
 *                                  country:
 *                                      type: string
 *                                      description: País
 *                                  default:
 *                                      type: boolean
 *                                      description: Indica si es la dirección predeterminada
 *      responses:
 *          '200':
 *              description: Dirección añadida con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: "OK"
 *          '400':
 *              description: Error en la solicitud
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
 *                                          example: 3000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Datos necesarios no proporcionados"
 *                                          description: Mensaje de error
 *          '401':
 *              description: No autorizado
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
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
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
 *      security:
 *          - bearerAuth: []
 */
userRouter.post('/profile/address/add', userProfileAddressAddController)

/**
 * @swagger
 * /user/profile/address/remove:
 *  post:
 *      tags:
 *          - Usuario
 *      summary: Elimina una dirección del usuario
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - addressId
 *                      properties:
 *                          addressId:
 *                              type: string
 *                              description: ID de la dirección a eliminar
 *      responses:
 *          '200':
 *              description: Dirección eliminada con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: "OK"
 *          '400':
 *              description: Error en la solicitud
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
 *                                          example: 3000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Datos necesarios no proporcionados"
 *                                          description: Mensaje de error
 *          '401':
 *              description: No autorizado
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
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
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
 *      security:
 *          - bearerAuth: []
 */
userRouter.post('/profile/address/remove', userProfileAddressRemoveController)

/**
 * @swagger
 * /user/is-following:
 *  post:
 *      tags:
 *          - Usuario
 *      summary: Comprueba si el usuario está siguiendo a un artista
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - artistUsername
 *                      properties:
 *                          artistUsername:
 *                              type: string
 *                              description: Nombre de usuario del artista
 *      responses:
 *          '200':
 *              description: Comprobación realizada con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      following:
 *                                          type: boolean
 *                                          description: Indica si el usuario sigue al artista
 *          '400':
 *              description: Error en la solicitud
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
 *                                          example: 3000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Datos necesarios no proporcionados"
 *                                          description: Mensaje de error
 *          '401':
 *              description: No autorizado
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
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
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
 *      security:
 *          - bearerAuth: []
 */
userRouter.post('/is-following', userIsFollowingController)

userRouter.post('/follow', userFollowController)
userRouter.post('/unfollow', userUnfollowController)

/**
 * @swagger
 * /user/profile/address/set-default:
 *  patch:
 *      tags:
 *          - Usuario
 *      summary: Establece una dirección como predeterminada
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - addressId
 *                      properties:
 *                          addressId:
 *                              type: string
 *                              description: ID de la dirección a establecer como predeterminada
 *      responses:
 *          '200':
 *              description: Dirección establecida como predeterminada con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: "OK"
 *          '400':
 *              description: Error en la solicitud
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
 *                                          example: 3000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Datos necesarios no proporcionados"
 *                                          description: Mensaje de error
 *          '401':
 *              description: No autorizado
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
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
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
 *      security:
 *          - bearerAuth: []
 */
userRouter.patch('/profile/address/set-default', userProfileAddressSetDefaultController)

/**
 * @swagger
 * /user/featured/content:
 *  get:
 *      tags:
 *          - Usuario
 *      summary: Obtiene contenido destacado para el usuario
 *      responses:
 *          '200':
 *              description: Contenido destacado obtenido con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          _id:
 *                                              type: string
 *                                              description: ID del contenido
 *                                          title:
 *                                              type: string
 *                                              description: Título del contenido
 *                                          imgUrl:
 *                                              type: string
 *                                              description: URL de la imagen
 *          '401':
 *              description: No autorizado
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
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
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
 *      security:
 *          - bearerAuth: []
 */
userRouter.get('/featured/content', userFeaturedContentController)

/**
 * @swagger
 * /user/featured/artists:
 *  get:
 *      tags:
 *          - Usuario
 *      summary: Obtiene artistas destacados para el usuario
 *      responses:
 *          '200':
 *              description: Artistas destacados obtenidos con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          name:
 *                                              type: string
 *                                              description: Nombre del artista
 *                                          imgUrl:
 *                                              type: string
 *                                              description: URL de la imagen del artista
 *          '401':
 *              description: No autorizado
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
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
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
 *      security:
 *          - bearerAuth: []
 */
userRouter.get('/featured/artists', userFeaturedArtistsController)

/**
 * @swagger
 * /user/library/songs:
 *  get:
 *      tags:
 *          - Usuario
 *      summary: Obtiene las canciones de la biblioteca del usuario
 *      responses:
 *          '200':
 *              description: Canciones obtenidas con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          _id:
 *                                              type: string
 *                                              description: ID de la canción
 *                                          title:
 *                                              type: string
 *                                              description: Título de la canción
 *                                          imgUrl:
 *                                              type: string
 *                                              description: URL de la portada
 *                                          author:
 *                                              type: string
 *                                              description: ID del autor
 *          '401':
 *              description: No autorizado
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
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
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
 *      security:
 *          - bearerAuth: []
 */
userRouter.get('/library/songs', userLibrarySongsController)

/**
 * @swagger
 * /user/library/albums:
 *  get:
 *      tags:
 *          - Usuario
 *      summary: Obtiene los álbumes de la biblioteca del usuario
 *      responses:
 *          '200':
 *              description: Álbumes obtenidos con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          _id:
 *                                              type: string
 *                                              description: ID del álbum
 *                                          title:
 *                                              type: string
 *                                              description: Título del álbum
 *                                          imgUrl:
 *                                              type: string
 *                                              description: URL de la portada
 *                                          author:
 *                                              type: string
 *                                              description: ID del autor
 *          '401':
 *              description: No autorizado
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
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
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
 *      security:
 *          - bearerAuth: []
 */
userRouter.get('/library/albums', userLibraryAlbumsController)

/**
 * @swagger
 * /user/orders:
 *  get:
 *      tags:
 *          - Usuario
 *      summary: Obtiene los pedidos del usuario
 *      responses:
 *          '200':
 *              description: Pedidos obtenidos con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          _id:
 *                                              type: string
 *                                              description: ID del pedido
 *                                          purchaseDate:
 *                                              type: string
 *                                              format: date
 *                                              description: Fecha de compra
 *                                          status:
 *                                              type: string
 *                                              enum: [processing, shipped, delivered]
 *                                              description: Estado del pedido
 *                                          paid:
 *                                              type: boolean
 *                                              description: Indica si el pedido está pagado
 *                                          lines:
 *                                              type: array
 *                                              items:
 *                                                  type: object
 *                                                  properties:
 *                                                      quantity:
 *                                                          type: number
 *                                                          description: Cantidad
 *                                                      price:
 *                                                          type: number
 *                                                          description: Precio
 *                                                      format:
 *                                                          type: string
 *                                                          enum: [digital, cd, vinyl, cassette]
 *                                                          description: Formato
 *          '401':
 *              description: No autorizado
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
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
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
 *      security:
 *          - bearerAuth: []
 */
userRouter.get('/orders', userOrdersController)

/**
 * @swagger
 * /user/orders/order:
 *  post:
 *      tags:
 *          - Usuario
 *      summary: Obtiene la información detallada de un pedido específico
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - orderId
 *                      properties:
 *                          orderId:
 *                              type: string
 *                              description: ID del pedido a consultar
 *      responses:
 *          '200':
 *              description: Información del pedido obtenida con éxito
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      _id:
 *                                          type: string
 *                                          description: ID del pedido
 *                                      purchaseDate:
 *                                          type: string
 *                                          format: date
 *                                          description: Fecha de compra
 *                                      status:
 *                                          type: string
 *                                          enum: [processing, shipped, delivered]
 *                                          description: Estado del pedido
 *                                      paid:
 *                                          type: boolean
 *                                          description: Indica si el pedido está pagado
 *                                      lines:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              properties:
 *                                                  quantity:
 *                                                      type: number
 *                                                      description: Cantidad
 *                                                  price:
 *                                                      type: number
 *                                                      description: Precio
 *                                                  format:
 *                                                      type: string
 *                                                      enum: [digital, cd, vinyl, cassette]
 *                                                      description: Formato
 *          '400':
 *              description: Error en la solicitud
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
 *                                          example: 3000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Datos necesarios no proporcionados"
 *                                          description: Mensaje de error
 *          '401':
 *              description: No autorizado
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
 *                                          example: 1000
 *                                          description: Código de error
 *                                      message:
 *                                          type: string
 *                                          example: "Token de usuario no proporcionado"
 *                                          description: Mensaje de error
 *          '500':
 *              description: Error del servidor
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
 *      security:
 *          - bearerAuth: []
 */
userRouter.post('/orders/order', userOrdersOrderController)

userRouter.get('/stats', userStatsController)

// NO REVISADAS

//userRouter.post('/profile/update/email', userEmailUpdateController)
//userRouter.post('/profile/update/password', userPasswordResetController)