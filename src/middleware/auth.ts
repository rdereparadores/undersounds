// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserAuth from '../models/UserAuth';
import { UserRole } from '../constants';

export interface AuthRequest extends Request {
    userId?: string;
    user?: any;
}

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * Middleware para verificar la autenticación del usuario
 * Verifica el token JWT en los headers y extrae el ID del usuario
 */
export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Obtener token del header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({ success: false, message: 'Acceso denegado. No hay token.' });
            return;
        }

        // Verificar token
        const secret = String(process.env.JWT_SECRET || 'secretkey');
        const decoded = jwt.verify(token, secret) as { id: string };

        // Buscar usuario
        const user = await UserAuth.findById(decoded.id).select('-password');

        if (!user) {
            res.status(401).json({ success: false, message: 'Usuario no encontrado.' });
            return;
        }

        // Añadir el ID del usuario y el usuario a la solicitud
        req.userId = decoded.id;
        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Token inválido.' });
    }
};

/**
 * Middleware para verificar que el usuario tiene el rol adecuado
 * @param roles - Roles requeridos
 */
export const roleMiddleware = (roles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Usuario no autenticado.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'No tienes permiso para acceder a este recurso.' });
        }

        next();
    };
};

// Middleware específico para usuarios normales
export const userMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    roleMiddleware([UserRole.USER, UserRole.ADMIN])(req, res, next);
};

// Middleware específico para artistas
export const artistMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    roleMiddleware([UserRole.ARTIST, UserRole.ADMIN])(req, res, next);
};

// Middleware específico para administradores
export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    roleMiddleware([UserRole.ADMIN])(req, res, next);
};