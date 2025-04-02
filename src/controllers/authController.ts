import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import UserAuth from '../models/UserAuth';

// Generar token JWT
const generateToken = (id: string): string => {
    // Crear objeto payload
    const payload = { id };

    // Obtener secreto
    const secret = String(process.env.JWT_SECRET || 'secretkey');

    // Crear opciones - usamos as const para forzar el tipo literal
    const options = {
        expiresIn: '7d' as const // Tipo literal que coincide con StringValue
    };

    // Firmar token con tipos correctos
    return jwt.sign(payload, secret, options);
};

// Registro de usuario
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password, role = 'user', name, surname } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await UserAuth.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: existingUser.email === email
                    ? 'El email ya está registrado'
                    : 'El nombre de usuario ya está en uso'
            });
            return;
        }

        // Crear nuevo usuario
        const user = new UserAuth({
            username,
            email,
            password,
            role,
            name,
            surname
        });

        await user.save();

        // Asegurarse de que el _id sea string antes de usarlo
        const userId = user._id instanceof mongoose.Types.ObjectId
            ? user._id.toString()
            : String(user._id);

        // Generar token
        const token = generateToken(userId);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: userId,
                username: user.username,
                email: user.email,
                role: user.role,
                name: user.name,
                surname: user.surname
            }
        });
    } catch (error: any) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el registro',
            error: error.message
        });
    }
};

// Registro de artista
export const registerArtist = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            username,
            email,
            password,
            name,
            surname,
            artist_name
        } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await UserAuth.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: existingUser.email === email
                    ? 'El email ya está registrado'
                    : 'El nombre de usuario ya está en uso'
            });
            return;
        }

        // Verificar si el nombre artístico ya existe
        if (artist_name) {
            const existingArtist = await UserAuth.findOne({ artist_name });
            if (existingArtist) {
                res.status(400).json({
                    success: false,
                    message: 'El nombre artístico ya está en uso'
                });
                return;
            }
        }

        // Crear nuevo usuario con rol de artista
        const user = new UserAuth({
            username,
            email,
            password,
            role: 'artist',
            name,
            surname,
            artist_name
        });

        await user.save();

        // Asegurarse de que el _id sea string antes de usarlo
        const userId = user._id instanceof mongoose.Types.ObjectId
            ? user._id.toString()
            : String(user._id);

        // Generar token
        const token = generateToken(userId);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: userId,
                username: user.username,
                email: user.email,
                role: user.role,
                name: user.name,
                surname: user.surname,
                artist_name: user.artist_name
            }
        });
    } catch (error: any) {
        console.error('Error en registro de artista:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el registro de artista',
            error: error.message
        });
    }
};

// Login de usuario
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Verificar que se proporcionen email y password
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Por favor, proporcione email y contraseña'
            });
            return;
        }

        // Buscar usuario por email
        const user = await UserAuth.findOne({ email });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
            return;
        }

        // Verificar contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
            return;
        }

        // Asegurarse de que el _id sea string antes de usarlo
        const userId = user._id instanceof mongoose.Types.ObjectId
            ? user._id.toString()
            : String(user._id);

        // Generar token
        const token = generateToken(userId);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: userId,
                username: user.username,
                email: user.email,
                role: user.role,
                name: user.name,
                surname: user.surname,
                artist_name: user.artist_name
            }
        });
    } catch (error: any) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el login',
            error: error.message
        });
    }
};

// Obtener perfil de usuario
export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;

        const user = await UserAuth.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error: any) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener perfil',
            error: error.message
        });
    }
};

// Actualizar perfil de usuario
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const { name, surname, birthdate } = req.body;

        const user = await UserAuth.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }

        // Actualizar campos
        user.name = name || user.name;
        user.surname = surname || user.surname;
        if (birthdate) user.birthdate = new Date(birthdate);

        await user.save();

        // Asegurarse de que el _id sea string antes de usarlo
        const userIdStr = user._id instanceof mongoose.Types.ObjectId
            ? user._id.toString()
            : String(user._id);

        res.status(200).json({
            success: true,
            message: 'Perfil actualizado correctamente',
            data: {
                id: userIdStr,
                username: user.username,
                email: user.email,
                role: user.role,
                name: user.name,
                surname: user.surname,
                birthdate: user.birthdate
            }
        });
    } catch (error: any) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar perfil',
            error: error.message
        });
    }
};

// Actualizar email
export const updateEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const { email } = req.body;

        // Verificar si el email ya está en uso
        const existingUser = await UserAuth.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'El email ya está registrado por otro usuario'
            });
            return;
        }

        const user = await UserAuth.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }

        // Actualizar email
        user.email = email;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Email actualizado correctamente'
        });
    } catch (error: any) {
        console.error('Error al actualizar email:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar email',
            error: error.message
        });
    }
};

// Actualizar contraseña
export const updatePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const { currentPassword, newPassword } = req.body;

        const user = await UserAuth.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }

        // Verificar contraseña actual
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: 'Contraseña actual incorrecta'
            });
            return;
        }

        // Actualizar contraseña
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Contraseña actualizada correctamente'
        });
    } catch (error: any) {
        console.error('Error al actualizar contraseña:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar contraseña',
            error: error.message
        });
    }
};