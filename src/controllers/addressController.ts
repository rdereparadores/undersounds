import { Request, Response } from 'express';
import Address from '../models/Address';
import User from '../models/User';
import Artist from '../models/Artist';

// Crear una nueva dirección independiente
export const createAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            alias,
            address,
            province,
            city,
            zip_code,
            country,
            observations
        } = req.body;

        // Crear nueva dirección
        const newAddress = new Address({
            alias,
            address,
            province,
            city,
            zip_code,
            country,
            observations
        });

        const savedAddress = await newAddress.save();

        res.status(201).json({
            success: true,
            message: 'Dirección creada exitosamente',
            data: savedAddress
        });
    } catch (error) {
        console.error('Error al crear dirección:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear dirección',
            error: (error as Error).message
        });
    }
};

// Obtener todas las direcciones
export const getAddresses = async (_req: Request, res: Response): Promise<void> => {
    try {
        const addresses = await Address.find().sort({ alias: 1 });

        res.status(200).json({
            success: true,
            count: addresses.length,
            data: addresses
        });
    } catch (error) {
        console.error('Error al obtener direcciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener direcciones',
            error: (error as Error).message
        });
    }
};

// Obtener una dirección por ID
export const getAddressById = async (req: Request, res: Response): Promise<void> => {
    try {
        const addressId = req.params.id;

        const address = await Address.findById(addressId);
        if (!address) {
            res.status(404).json({
                success: false,
                message: 'Dirección no encontrada'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: address
        });
    } catch (error) {
        console.error('Error al obtener dirección:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener dirección',
            error: (error as Error).message
        });
    }
};

// Actualizar una dirección
export const updateAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const addressId = req.params.id;
        const {
            alias,
            address,
            province,
            city,
            zip_code,
            country,
            observations
        } = req.body;

        // Verificar que la dirección existe
        const existingAddress = await Address.findById(addressId);
        if (!existingAddress) {
            res.status(404).json({
                success: false,
                message: 'Dirección no encontrada'
            });
            return;
        }

        // Actualizar dirección
        const updatedAddress = await Address.findByIdAndUpdate(
            addressId,
            {
                alias,
                address,
                province,
                city,
                zip_code,
                country,
                observations
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Dirección actualizada exitosamente',
            data: updatedAddress
        });
    } catch (error) {
        console.error('Error al actualizar dirección:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar dirección',
            error: (error as Error).message
        });
    }
};

// Eliminar una dirección
export const deleteAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const addressId = req.params.id;

        // Verificar que la dirección existe
        const address = await Address.findById(addressId);
        if (!address) {
            res.status(404).json({
                success: false,
                message: 'Dirección no encontrada'
            });
            return;
        }

        // Verificar si la dirección está asociada a usuarios o artistas
        const usersWithAddress = await User.countDocuments({ 'address._id': addressId });
        const artistsWithAddress = await Artist.countDocuments({ address: addressId });

        if (usersWithAddress > 0 || artistsWithAddress > 0) {
            res.status(400).json({
                success: false,
                message: 'No se puede eliminar la dirección porque está asociada a usuarios o artistas'
            });
            return;
        }

        await Address.findByIdAndDelete(addressId);

        res.status(200).json({
            success: true,
            message: 'Dirección eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar dirección:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar dirección',
            error: (error as Error).message
        });
    }
};

// Agregar una dirección a un usuario
export const addAddressToUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const addressData = req.body;

        // Verificar que el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }

        // Agregar dirección al usuario
        user.address.push(addressData);
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Dirección agregada al usuario exitosamente',
            data: user.address[user.address.length - 1]
        });
    } catch (error) {
        console.error('Error al agregar dirección al usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al agregar dirección al usuario',
            error: (error as Error).message
        });
    }
};

// Agregar una dirección a un artista
export const addAddressToArtist = async (req: Request, res: Response): Promise<void> => {
    try {
        const artistId = req.params.artistId;
        const { addressId } = req.body;

        // Verificar que el artista existe
        const artist = await Artist.findById(artistId);
        if (!artist) {
            res.status(404).json({
                success: false,
                message: 'Artista no encontrado'
            });
            return;
        }

        // Verificar que la dirección existe
        const address = await Address.findById(addressId);
        if (!address) {
            res.status(404).json({
                success: false,
                message: 'Dirección no encontrada'
            });
            return;
        }

        // Verificar que la dirección no esté ya asociada al artista
        if (artist.address.some((addr: any) => addr.toString() === addressId)) {
            res.status(400).json({
                success: false,
                message: 'La dirección ya está asociada al artista'
            });
            return;
        }

        // Agregar dirección al artista
        artist.address.push(addressId as any);
        await artist.save();

        res.status(200).json({
            success: true,
            message: 'Dirección agregada al artista exitosamente',
            data: {
                artist: artist._id,
                address: addressId
            }
        });
    } catch (error) {
        console.error('Error al agregar dirección al artista:', error);
        res.status(500).json({
            success: false,
            message: 'Error al agregar dirección al artista',
            error: (error as Error).message
        });
    }
};

// Eliminar una dirección de un usuario
export const removeAddressFromUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const addressId = req.params.addressId;

        // Verificar que el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }

        // Encontrar el índice de la dirección
        const addressIndex = user.address.findIndex(
            (addr: any) => addr._id.toString() === addressId
        );

        if (addressIndex === -1) {
            res.status(404).json({
                success: false,
                message: 'Dirección no encontrada en el usuario'
            });
            return;
        }

        // Eliminar la dirección del array
        user.address.splice(addressIndex, 1);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Dirección eliminada del usuario exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar dirección del usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar dirección del usuario',
            error: (error as Error).message
        });
    }
};

// Eliminar una dirección de un artista
export const removeAddressFromArtist = async (req: Request, res: Response): Promise<void> => {
    try {
        const artistId = req.params.artistId;
        const addressId = req.params.addressId;

        // Verificar que el artista existe
        const artist = await Artist.findById(artistId);
        if (!artist) {
            res.status(404).json({
                success: false,
                message: 'Artista no encontrado'
            });
            return;
        }

        // Encontrar el índice de la dirección
        const addressIndex = artist.address.findIndex(
            (addr: any) => addr.toString() === addressId
        );

        if (addressIndex === -1) {
            res.status(404).json({
                success: false,
                message: 'Dirección no encontrada en el artista'
            });
            return;
        }

        // Eliminar la dirección del array
        artist.address.splice(addressIndex, 1);
        await artist.save();

        res.status(200).json({
            success: true,
            message: 'Dirección eliminada del artista exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar dirección del artista:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar dirección del artista',
            error: (error as Error).message
        });
    }
};