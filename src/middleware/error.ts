// src/middleware/error.ts
import { Request, Response, NextFunction } from 'express';

/**
 * Error personalizado para la API
 */
export class APIError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Middleware para manejar errores de la API
 */
export const errorHandler = (err: Error | APIError, req: Request, res: Response, next: NextFunction): void => {
    console.error(`Error: ${err.message}`);
    console.error(err.stack);

    // Comprobar si es un error personalizado o genérico
    const statusCode = 'statusCode' in err ? err.statusCode : 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Error del servidor',
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
};

/**
 * Middleware para capturar rutas no encontradas
 */
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
    const error = new APIError(`Ruta no encontrada: ${req.originalUrl}`, 404);
    next(error);
};