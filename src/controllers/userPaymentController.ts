import { Request, Response } from 'express';
import UserPaymentMethod from '../models/UserPaymentMethod';

// Obtener métodos de pago del usuario
export const getUserPaymentMethods = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;

        const paymentMethods = await UserPaymentMethod.find({ user_id: userId }).sort({ is_default: -1, updatedAt: -1 });

        res.status(200).json({
            success: true,
            count: paymentMethods.length,
            data: paymentMethods
        });
    } catch (error: any) {
        console.error('Error al obtener métodos de pago:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener métodos de pago',
            error: error.message
        });
    }
};

// Añadir método de pago
export const addPaymentMethod = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const {
            alias,
            full_name,
            card_number,
            expiry_month,
            expiry_year,
            cvv,
            is_default = false
        } = req.body;

        // Validar número de tarjeta
        if (!validateCardNumber(card_number)) {
            res.status(400).json({
                success: false,
                message: 'Número de tarjeta inválido'
            });
            return;
        }

        // Validar fecha de expiración
        if (!validateExpiryDate(expiry_month, expiry_year)) {
            res.status(400).json({
                success: false,
                message: 'Fecha de expiración inválida'
            });
            return;
        }

        // Obtener últimos 4 dígitos de la tarjeta
        const card_last_4_digits = card_number.slice(-4);

        // Si el nuevo método será el predeterminado, actualizar los existentes
        if (is_default) {
            await UserPaymentMethod.updateMany(
                { user_id: userId, is_default: true },
                { is_default: false }
            );
        }

        // Crear nuevo método de pago
        const newPaymentMethod = new UserPaymentMethod({
            user_id: userId,
            alias,
            full_name,
            card_last_4_digits,
            expiry_month,
            expiry_year,
            is_default
        });

        const savedPaymentMethod = await newPaymentMethod.save();

        res.status(201).json({
            success: true,
            message: 'Método de pago añadido correctamente',
            data: savedPaymentMethod
        });
    } catch (error: any) {
        console.error('Error al añadir método de pago:', error);
        res.status(500).json({
            success: false,
            message: 'Error al añadir método de pago',
            error: error.message
        });
    }
};

// Eliminar método de pago
export const deletePaymentMethod = async (req: Request, res: Response): Promise<void> => {
    try {
        const paymentMethodId = req.params.id;

        // Buscar y eliminar el método de pago
        const deletedPaymentMethod = await UserPaymentMethod.findByIdAndDelete(paymentMethodId);

        if (!deletedPaymentMethod) {
            res.status(404).json({
                success: false,
                message: 'Método de pago no encontrado'
            });
            return;
        }

        // Si era el método predeterminado, establecer otro como predeterminado
        if (deletedPaymentMethod.is_default) {
            const otherPaymentMethod = await UserPaymentMethod.findOne({ user_id: deletedPaymentMethod.user_id });
            if (otherPaymentMethod) {
                otherPaymentMethod.is_default = true;
                await otherPaymentMethod.save();
            }
        }

        res.status(200).json({
            success: true,
            message: 'Método de pago eliminado correctamente'
        });
    } catch (error: any) {
        console.error('Error al eliminar método de pago:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar método de pago',
            error: error.message
        });
    }
};

// Funciones de validación
const validateCardNumber = (cardNumber: string): boolean => {
    // Algoritmo de Luhn (validación de tarjetas de crédito)
    const sanitized = cardNumber.replace(/\D/g, '');

    // Verificar longitud
    if (sanitized.length < 13 || sanitized.length > 19) {
        return false;
    }

    let sum = 0;
    let shouldDouble = false;

    // Recorrer el número de derecha a izquierda
    for (let i = sanitized.length - 1; i >= 0; i--) {
        let digit = parseInt(sanitized.charAt(i));

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
};

const validateExpiryDate = (month: number, year: number): boolean => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Enero es 0

    // Verificar que el mes esté entre 1 y 12
    if (month < 1 || month > 12) {
        return false;
    }

    // Verificar que la fecha no haya expirado
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return false;
    }

    return true;
};