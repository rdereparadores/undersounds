// src/controllers/userController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Artist from "../models/Artist";

// Crear un nuevo usuario
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, phone, birth_date, address, genres } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
            return;
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear nuevo usuario
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            birth_date,
            address,
            genres
        });

        const savedUser = await user.save();

        // Excluir la contraseña en la respuesta
        const userResponse = savedUser.toObject();
        const { password: _, ...userWithoutPassword } = userResponse;

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: userWithoutPassword
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear usuario',
            error: (error as Error).message
        });
    }
};

// Obtener todos los usuarios
export const getUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find().select('-password');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios',
            error: (error as Error).message
        });
    }
};

// Obtener un usuario por ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select('-password');
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
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuario',
            error: (error as Error).message
        });
    }
};

// Actualizar un usuario
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const { name, email, phone, birth_date } = req.body;

        // Verificar que el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }

        //Comprueba que el correo no exista en otros usuarios
        const existingUser = await User.findOne({
            $and: [
                { _id: { $ne: userId } },
                { email },
            ]
        });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
            return;
        }

        // Actualizar usuario
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email, phone, birth_date },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar usuario',
            error: (error as Error).message
        });
    }
};

// Eliminar un usuario
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;

        // Verificar que el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: 'Usuario eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar usuario',
            error: (error as Error).message
        });
    }
};

// Añadir una dirección a un usuario
export const addAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const addressData = req.body;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }

        user.address.push(addressData);
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Dirección agregada exitosamente',
            data: user.address[user.address.length - 1]
        });
    } catch (error) {
        console.error('Error al agregar dirección:', error);
        res.status(500).json({
            success: false,
            message: 'Error al agregar dirección',
            error: (error as Error).message
        });
    }
};