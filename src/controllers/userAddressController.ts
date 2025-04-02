import { Request, Response } from 'express';
import UserAddress from '../models/UserAddress';

// Obtener direcciones del usuario
export const getUserAddresses = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;

        const addresses = await UserAddress.find({ user_id: userId }).sort({ is_default: -1, updatedAt: -1 });

        res.status(200).json({
            success: true,
            count: addresses.length,
            data: addresses
        });
    } catch (error: any) {
        console.error('Error al obtener direcciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener direcciones',
            error: error.message
        });
    }
};

// Añadir dirección
export const addAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const {
            alias,
            full_name,
            address,
            notes,
            city,
            postal_code,
            country,
            phone,
            is_default = false
        } = req.body;

        // Si la nueva dirección será la predeterminada, actualizar las existentes
        if (is_default) {
            await UserAddress.updateMany(
                { user_id: userId, is_default: true },
                { is_default: false }
            );
        }

        // Crear nueva dirección
        const newAddress = new UserAddress({
            user_id: userId,
            alias,
            full_name,
            address,
            notes,
            city,
            postal_code,
            country,
            phone,
            is_default
        });

        const savedAddress = await newAddress.save();

        res.status(201).json({
            success: true,
            message: 'Dirección añadida correctamente',
            data: savedAddress
        });
    } catch (error: any) {
        console.error('Error al añadir dirección:', error);
        res.status(500).json({
            success: false,
            message: 'Error al añadir dirección',
            error: error.message
        });
    }
};

// Actualizar dirección
export const updateAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const addressId = req.params.id;
        const {
            alias,
            full_name,
            address,
            notes,
            city,
            postal_code,
            country,
            phone,
            is_default = false
        } = req.body;

        // Buscar la dirección
        const existingAddress = await UserAddress.findById(addressId);
        if (!existingAddress) {
            res.status(404).json({
                success: false,
                message: 'Dirección no encontrada'
            });
            return;
        }

        // Si la dirección se marcará como predeterminada, actualizar las demás
        if (is_default && !existingAddress.is_default) {
            await UserAddress.updateMany(
                { user_id: existingAddress.user_id, is_default: true },
                { is_default: false }
            );
        }

        // Actualizar la dirección
        const updatedAddress = await UserAddress.findByIdAndUpdate(
            addressId,
            {
                alias,
                full_name,
                address,
                notes,
                city,
                postal_code,
                country,
                phone,
                is_default
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Dirección actualizada correctamente',
            data: updatedAddress
        });
    } catch (error: any) {
        console.error('Error al actualizar dirección:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar dirección',
            error: error.message
        });
    }
};

// Eliminar dirección
export const deleteAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const addressId = req.params.id;

        // Buscar y eliminar la dirección
        const deletedAddress = await UserAddress.findByIdAndDelete(addressId);

        if (!deletedAddress) {
            res.status(404).json({
                success: false,
                message: 'Dirección no encontrada'
            });
            return;
        }

        // Si era la dirección predeterminada, establecer otra como predeterminada
        if (deletedAddress.is_default) {
            const otherAddress = await UserAddress.findOne({ user_id: deletedAddress.user_id });
            if (otherAddress) {
                otherAddress.is_default = true;
                await otherAddress.save();
            }
        }

        res.status(200).json({
            success: true,
            message: 'Dirección eliminada correctamente'
        });
    } catch (error: any) {
        console.error('Error al eliminar dirección:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar dirección',
            error: error.message
        });
    }
};

// Establecer dirección predeterminada
export const setDefaultAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const addressId = req.params.addressId;

        // Primero desmarcar todas las direcciones predeterminadas
        await UserAddress.updateMany(
            { user_id: userId },
            { is_default: false }
        );

        // Establecer la nueva dirección predeterminada
        const updatedAddress = await UserAddress.findByIdAndUpdate(
            addressId,
            { is_default: true },
            { new: true }
        );

        if (!updatedAddress) {
            res.status(404).json({
                success: false,
                message: 'Dirección no encontrada'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Dirección establecida como predeterminada',
            data: updatedAddress
        });
    } catch (error: any) {
        console.error('Error al establecer dirección predeterminada:', error);
        res.status(500).json({
            success: false,
            message: 'Error al establecer dirección predeterminada',
            error: error.message
        });
    }
};