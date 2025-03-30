// src/controllers/providerController.ts
import { Request, Response } from 'express';
import Provider from '../models/Provider';
import Purchase from '../models/Purchase';

// Crear un nuevo proveedor
export const createProvider = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, phone, address } = req.body;

        // Verificar si el proveedor ya existe
        const existingProvider = await Provider.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingProvider) {
            res.status(400).json({
                success: false,
                message: 'Ya existe un proveedor con ese nombre'
            });
            return;
        }

        // Crear nuevo proveedor
        const provider = new Provider({
            name,
            phone,
            address
        });

        const savedProvider = await provider.save();

        res.status(201).json({
            success: true,
            message: 'Proveedor creado exitosamente',
            data: savedProvider
        });
    } catch (error) {
        console.error('Error al crear proveedor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear proveedor',
            error: (error as Error).message
        });
    }
};

// Obtener todos los proveedores
export const getProviders = async (_req: Request, res: Response): Promise<void> => {
    try {
        const providers = await Provider.find().sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: providers.length,
            data: providers
        });
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener proveedores',
            error: (error as Error).message
        });
    }
};

// Obtener un proveedor por ID
export const getProviderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const providerId = req.params.id;

        const provider = await Provider.findById(providerId);
        if (!provider) {
            res.status(404).json({
                success: false,
                message: 'Proveedor no encontrado'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: provider
        });
    } catch (error) {
        console.error('Error al obtener proveedor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener proveedor',
            error: (error as Error).message
        });
    }
};

// Actualizar un proveedor
export const updateProvider = async (req: Request, res: Response): Promise<void> => {
    try {
        const providerId = req.params.id;
        const { name, phone, address } = req.body;

        // Verificar que el proveedor existe
        const provider = await Provider.findById(providerId);
        if (!provider) {
            res.status(404).json({
                success: false,
                message: 'Proveedor no encontrado'
            });
            return;
        }

        // Verificar si ya existe otro proveedor con el mismo nombre
        if (name && name !== provider.name) {
            const duplicateProvider = await Provider.findOne({
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: providerId }
            });

            if (duplicateProvider) {
                res.status(400).json({
                    success: false,
                    message: 'Ya existe un proveedor con ese nombre'
                });
                return;
            }
        }

        // Actualizar proveedor
        const updatedProvider = await Provider.findByIdAndUpdate(
            providerId,
            { name, phone, address },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Proveedor actualizado exitosamente',
            data: updatedProvider
        });
    } catch (error) {
        console.error('Error al actualizar proveedor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar proveedor',
            error: (error as Error).message
        });
    }
};

// Eliminar un proveedor
export const deleteProvider = async (req: Request, res: Response): Promise<void> => {
    try {
        const providerId = req.params.id;

        // Verificar que el proveedor existe
        const provider = await Provider.findById(providerId);
        if (!provider) {
            res.status(404).json({
                success: false,
                message: 'Proveedor no encontrado'
            });
            return;
        }

        // Verificar si hay compras asociadas a este proveedor
        const purchasesCount = await Purchase.countDocuments({ provider: providerId });

        if (purchasesCount > 0) {
            res.status(400).json({
                success: false,
                message: 'No se puede eliminar el proveedor porque está asociado a compras'
            });
            return;
        }

        await Provider.findByIdAndDelete(providerId);

        res.status(200).json({
            success: true,
            message: 'Proveedor eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar proveedor',
            error: (error as Error).message
        });
    }
};

// Obtener las compras asociadas a un proveedor
export const getProviderPurchases = async (req: Request, res: Response): Promise<void> => {
    try {
        const providerId = req.params.id;

        // Verificar que el proveedor existe
        const provider = await Provider.findById(providerId);
        if (!provider) {
            res.status(404).json({
                success: false,
                message: 'Proveedor no encontrado'
            });
            return;
        }

        // Obtener las compras del proveedor
        const purchases = await Purchase.find({ provider: providerId })
            .populate('client', 'name email')
            .populate('seller', 'artist_name')
            .populate('song', 'name')
            .populate('album', 'name')
            .sort({ purchase_date: -1 });

        res.status(200).json({
            success: true,
            count: purchases.length,
            data: purchases
        });
    } catch (error) {
        console.error('Error al obtener compras del proveedor:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener compras del proveedor',
            error: (error as Error).message
        });
    }
};