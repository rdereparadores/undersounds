// src/routes/paymentRoutes.ts
import express from 'express';
import * as paymentController from '../controllers/paymentController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Métodos de Pago
 *   description: Operaciones relacionadas con métodos de pago
 */

// Todas las rutas de métodos de pago requieren autenticación
router.use(authMiddleware);

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Obtener todos los métodos de pago
 *     tags: [Métodos de Pago]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de métodos de pago
 */
router.get('/', paymentController.getPaymentMethods);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Crear un nuevo método de pago
 *     tags: [Métodos de Pago]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titular
 *               - card_number
 *               - cvv
 *               - month
 *               - year
 *             properties:
 *               titular:
 *                 type: string
 *               card_number:
 *                 type: string
 *               cvv:
 *                 type: string
 *               month:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 12
 *               year:
 *                 type: number
 *               alias:
 *                 type: string
 *     responses:
 *       201:
 *         description: Método de pago creado exitosamente
 *       400:
 *         description: Datos inválidos en la petición
 */
router.post('/', paymentController.createPaymentMethod);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Obtener un método de pago por ID
 *     tags: [Métodos de Pago]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del método de pago
 *       404:
 *         description: Método de pago no encontrado
 */
router.get('/:id', paymentController.getPaymentMethodById);

/**
 * @swagger
 * /api/payments/{id}:
 *   put:
 *     summary: Actualizar un método de pago
 *     tags: [Métodos de Pago]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titular:
 *                 type: string
 *               card_number:
 *                 type: string
 *               cvv:
 *                 type: string
 *               month:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 12
 *               year:
 *                 type: number
 *               alias:
 *                 type: string
 *     responses:
 *       200:
 *         description: Método de pago actualizado exitosamente
 *       404:
 *         description: Método de pago no encontrado
 */
router.put('/:id', paymentController.updatePaymentMethod);

/**
 * @swagger
 * /api/payments/{id}:
 *   delete:
 *     summary: Eliminar un método de pago
 *     tags: [Métodos de Pago]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Método de pago eliminado exitosamente
 *       404:
 *         description: Método de pago no encontrado
 */
router.delete('/:id', paymentController.deletePaymentMethod);

export default router;