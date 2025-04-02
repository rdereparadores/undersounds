
import { body } from 'express-validator';

export const createUserValidator = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('name').notEmpty().withMessage('El nombre es requerido')
];

// Y en las rutas:
//router.post('/', createUserValidator, userController.createUser);