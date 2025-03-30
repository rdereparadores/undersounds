import { Request, Response } from 'express';
import PaymentMethod from '../models/PaymentMethod';

// Crear un nuevo método de pago
export const createPaymentMethod = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            titular,
            card_number,
            cvv,
            month,
            year,
            alias
        } = req.body;

        // Validar datos de la tarjeta
        if (!validateCardNumber(card_number)) {
            res.status(400).json({
                success: false,
                message: 'Número de tarjeta inválido'
            });
            return;
        }

        if (!validateCVV(cvv)) {
            res.status(400).json({
                success: false,
                message: 'CVV inválido'
            });
            return;
        }

        if (!validateExpiryDate(month, year)) {
            res.status(400).json({
                success: false,
                message: 'Fecha de expiración inválida o tarjeta vencida'
            });
            return;
        }

        // Crear nuevo método de pago
        const paymentMethod = new PaymentMethod({
            titular,
            card_number,
            cvv,
            month,
            year,
            alias
        });

        const savedPaymentMethod = await paymentMethod.save();

        // No devolver los datos sensibles en la respuesta
        const savedMethodObj = savedPaymentMethod.toObject();
        const response = {
            _id: savedMethodObj._id,
            titular: savedMethodObj.titular,
            card_number: maskCardNumber(savedMethodObj.card_number),
            month: savedMethodObj.month,
            year: savedMethodObj.year,
            alias: savedMethodObj.alias,
            createdAt: savedMethodObj.createdAt
        };

        res.status(201).json({
            success: true,
            message: 'Método de pago creado exitosamente',
            data: response
        });
    } catch (error) {
        console.error('Error al crear método de pago:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear método de pago',
            error: (error as Error).message
        });
    }
};

// Obtener todos los métodos de pago
export const getPaymentMethods = async (_req: Request, res: Response): Promise<void> => {
    try {
        const paymentMethods = await PaymentMethod.find()
            .select('-cvv') // No incluir el CVV en la respuesta
            .sort({ createdAt: -1 });

        // Enmascarar números de tarjeta
        const maskedPaymentMethods = paymentMethods.map(method => {
            const methodObj = method.toObject();
            methodObj.card_number = maskCardNumber(methodObj.card_number);
            return methodObj;
        });

        res.status(200).json({
            success: true,
            count: maskedPaymentMethods.length,
            data: maskedPaymentMethods
        });
    } catch (error) {
        console.error('Error al obtener métodos de pago:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener métodos de pago',
            error: (error as Error).message
        });
    }
};

// Obtener un método de pago por ID
export const getPaymentMethodById = async (req: Request, res: Response): Promise<void> => {
    try {
        const paymentMethodId = req.params.id;

        const paymentMethod = await PaymentMethod.findById(paymentMethodId)
            .select('-cvv'); // No incluir el CVV en la respuesta

        if (!paymentMethod) {
            res.status(404).json({
                success: false,
                message: 'Método de pago no encontrado'
            });
            return;
        }

        // Enmascarar número de tarjeta
        const response = paymentMethod.toObject();
        response.card_number = maskCardNumber(response.card_number);

        res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.error('Error al obtener método de pago:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener método de pago',
            error: (error as Error).message
        });
    }
};

// Actualizar un método de pago
export const updatePaymentMethod = async (req: Request, res: Response): Promise<void> => {
    try {
        const paymentMethodId = req.params.id;
        const {
            titular,
            card_number,
            cvv,
            month,
            year,
            alias
        } = req.body;

        // Verificar que el método de pago existe
        const paymentMethod = await PaymentMethod.findById(paymentMethodId);
        if (!paymentMethod) {
            res.status(404).json({
                success: false,
                message: 'Método de pago no encontrado'
            });
            return;
        }

        // Validar los datos si se van a actualizar
        if (card_number && !validateCardNumber(card_number)) {
            res.status(400).json({
                success: false,
                message: 'Número de tarjeta inválido'
            });
            return;
        }

        if (cvv && !validateCVV(cvv)) {
            res.status(400).json({
                success: false,
                message: 'CVV inválido'
            });
            return;
        }

        if ((month || year) && !validateExpiryDate(
            month || paymentMethod.month,
            year || paymentMethod.year
        )) {
            res.status(400).json({
                success: false,
                message: 'Fecha de expiración inválida o tarjeta vencida'
            });
            return;
        }

        // Actualizar método de pago
        const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(
            paymentMethodId,
            {
                titular: titular || paymentMethod.titular,
                card_number: card_number || paymentMethod.card_number,
                cvv: cvv || paymentMethod.cvv,
                month: month || paymentMethod.month,
                year: year || paymentMethod.year,
                alias: alias || paymentMethod.alias
            },
            { new: true, runValidators: true }
        ).select('-cvv');

        if (!updatedPaymentMethod) {
            res.status(404).json({
                success: false,
                message: 'Método de pago no encontrado'
            });
            return;
        }

        // Enmascarar número de tarjeta
        const response = updatedPaymentMethod.toObject();
        response.card_number = maskCardNumber(response.card_number);

        res.status(200).json({
            success: true,
            message: 'Método de pago actualizado exitosamente',
            data: response
        });
    } catch (error) {
        console.error('Error al actualizar método de pago:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar método de pago',
            error: (error as Error).message
        });
    }
};

// Eliminar un método de pago
export const deletePaymentMethod = async (req: Request, res: Response): Promise<void> => {
    try {
        const paymentMethodId = req.params.id;

        // Verificar que el método de pago existe
        const paymentMethod = await PaymentMethod.findById(paymentMethodId);
        if (!paymentMethod) {
            res.status(404).json({
                success: false,
                message: 'Método de pago no encontrado'
            });
            return;
        }

        await PaymentMethod.findByIdAndDelete(paymentMethodId);

        res.status(200).json({
            success: true,
            message: 'Método de pago eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar método de pago:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar método de pago',
            error: (error as Error).message
        });
    }
};

// Funciones auxiliares para validación
const validateCardNumber = (cardNumber: string): boolean => {
    // Eliminar espacios y guiones
    const sanitizedCardNumber = cardNumber.replace(/[\s-]/g, '');

    // Verificar que solo contiene dígitos
    if (!/^\d+$/.test(sanitizedCardNumber)) {
        return false;
    }

    // Verificar longitud (la mayoría de las tarjetas tienen entre 13 y 19 dígitos)
    if (sanitizedCardNumber.length < 13 || sanitizedCardNumber.length > 19) {
        return false;
    }

    // Algoritmo de Luhn (validación básica de tarjetas)
    let sum = 0;
    let shouldDouble = false;

    // Recorrer de derecha a izquierda
    for (let i = sanitizedCardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(sanitizedCardNumber.charAt(i));

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
};

const validateCVV = (cvv: string): boolean => {
    // Verificar que solo contiene dígitos
    if (!/^\d+$/.test(cvv)) {
        return false;
    }

    // La mayoría de las tarjetas tienen CVV de 3 dígitos, Amex tiene 4
    return cvv.length >= 3 && cvv.length <= 4;
};

const validateExpiryDate = (month: number, year: number): boolean => {
    // Verificar rango de mes
    if (month < 1 || month > 12) {
        return false;
    }

    // Obtener la fecha actual
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth devuelve 0-11

    // Verificar que no esté expirada
    if (year < currentYear) {
        return false;
    }

    if (year === currentYear && month < currentMonth) {
        return false;
    }

    // Verificar que no sea una fecha muy lejana (más de 10 años)
    if (year > currentYear + 10) {
        return false;
    }

    return true;
};

const maskCardNumber = (cardNumber: string): string => {
    // Eliminar espacios y guiones
    const sanitizedCardNumber = cardNumber.replace(/[\s-]/g, '');

    // Mostrar solo los últimos 4 dígitos
    const lastFourDigits = sanitizedCardNumber.slice(-4);
    const maskedPart = '*'.repeat(sanitizedCardNumber.length - 4);

    // Formatear como XXXX-XXXX-XXXX-1234
    const formatted = `${maskedPart}${lastFourDigits}`;

    // Insertar guiones cada 4 caracteres para mejorar la legibilidad
    return formatted.replace(/(.{4})/g, '$1-').slice(0, -1);
};