import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Purchase from '../models/Purchase';
import Song from '../models/Song';
import Album from '../models/Album';
import User from '../models/User';
import Artist from '../models/Artist';
import Provider from '../models/Provider';

// Crear una nueva compra
export const createPurchase = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            song,
            album,
            client,
            seller,
            price,
            status = 'pending',
            provider,
            purchase_date = new Date()
        } = req.body;

        // Verificar que se proporciona una canción o un álbum, pero no ambos
        if ((!song && !album) || (song && album)) {
            res.status(400).json({
                success: false,
                message: 'Debe proporcionar una canción o un álbum, pero no ambos'
            });
            return;
        }

        // Verificar que el cliente existe
        const userExists = await User.findById(client);
        if (!userExists) {
            res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
            return;
        }

        // Verificar que el vendedor (artista) existe
        const artistExists = await Artist.findById(seller);
        if (!artistExists) {
            res.status(404).json({
                success: false,
                message: 'Artista no encontrado'
            });
            return;
        }

        // Verificar que la canción o el álbum existen
        if (song) {
            const songExists = await Song.findById(song);
            if (!songExists) {
                res.status(404).json({
                    success: false,
                    message: 'Canción no encontrada'
                });
                return;
            }
        }

        if (album) {
            const albumExists = await Album.findById(album);
            if (!albumExists) {
                res.status(404).json({
                    success: false,
                    message: 'Álbum no encontrado'
                });
                return;
            }
        }

        // Verificar que el provider existe si se proporciona
        if (provider) {
            const providerExists = await Provider.findById(provider);
            if (!providerExists) {
                res.status(404).json({
                    success: false,
                    message: 'Proveedor no encontrado'
                });
                return;
            }
        }

        // Crear la compra
        const purchase = new Purchase({
            song,
            album,
            client,
            seller,
            purchase_date,
            price,
            status,
            provider
        });

        const savedPurchase = await purchase.save();

        // Poblar los datos relacionados para la respuesta
        const populatedPurchase = await Purchase.findById(savedPurchase._id)
            .populate('client', 'name email')
            .populate('seller', 'artist_name')
            .populate('song', 'name')
            .populate('album', 'name')
            .populate('provider', 'name');

        res.status(201).json({
            success: true,
            message: 'Compra creada exitosamente',
            data: populatedPurchase
        });
    } catch (error) {
        console.error('Error al crear compra:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear compra',
            error: (error as Error).message
        });
    }
};

// Obtener todas las compras
export const getPurchases = async (req: Request, res: Response): Promise<void> => {
    try {
        const { client, seller, status } = req.query;
        let query: any = {};

        if (client) {
            query.client = client;
        }

        if (seller) {
            query.seller = seller;
        }

        if (status) {
            query.status = status;
        }

        const purchases = await Purchase.find(query)
            .populate('client', 'name email')
            .populate('seller', 'artist_name')
            .populate('song', 'name')
            .populate('album', 'name')
            .populate('provider', 'name')
            .sort({ purchase_date: -1 });

        res.status(200).json({
            success: true,
            count: purchases.length,
            data: purchases
        });
    } catch (error) {
        console.error('Error al obtener compras:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener compras',
            error: (error as Error).message
        });
    }
};

// Obtener una compra por ID
export const getPurchaseById = async (req: Request, res: Response): Promise<void> => {
    try {
        const purchaseId = req.params.id;

        const purchase = await Purchase.findById(purchaseId)
            .populate('client', 'name email')
            .populate('seller', 'artist_name')
            .populate('song', 'name')
            .populate('album', 'name')
            .populate('provider', 'name');

        if (!purchase) {
            res.status(404).json({
                success: false,
                message: 'Compra no encontrada'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: purchase
        });
    } catch (error) {
        console.error('Error al obtener compra:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener compra',
            error: (error as Error).message
        });
    }
};

// Actualizar el estado de una compra
export const updatePurchaseStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const purchaseId = req.params.id;
        const { status } = req.body;

        // Verificar que el estado es válido
        const validStatus = ['pending', 'completed', 'cancelled'];
        if (!validStatus.includes(status)) {
            res.status(400).json({
                success: false,
                message: 'Estado no válido. Los estados permitidos son: pending, completed, cancelled'
            });
            return;
        }

        // Verificar que la compra existe
        const purchase = await Purchase.findById(purchaseId);
        if (!purchase) {
            res.status(404).json({
                success: false,
                message: 'Compra no encontrada'
            });
            return;
        }

        // Actualizar el estado
        const updatedPurchase = await Purchase.findByIdAndUpdate(
            purchaseId,
            { status },
            { new: true, runValidators: true }
        )
            .populate('client', 'name email')
            .populate('seller', 'artist_name')
            .populate('song', 'name')
            .populate('album', 'name')
            .populate('provider', 'name');

        res.status(200).json({
            success: true,
            message: 'Estado de la compra actualizado exitosamente',
            data: updatedPurchase
        });
    } catch (error) {
        console.error('Error al actualizar estado de la compra:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar estado de la compra',
            error: (error as Error).message
        });
    }
};

// Eliminar una compra
export const deletePurchase = async (req: Request, res: Response): Promise<void> => {
    try {
        const purchaseId = req.params.id;

        // Verificar que la compra existe
        const purchase = await Purchase.findById(purchaseId);
        if (!purchase) {
            res.status(404).json({
                success: false,
                message: 'Compra no encontrada'
            });
            return;
        }

        await Purchase.findByIdAndDelete(purchaseId);

        res.status(200).json({
            success: true,
            message: 'Compra eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar compra:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar compra',
            error: (error as Error).message
        });
    }
};

// Obtener estadísticas de compras por artista
export const getArtistPurchaseStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const artistId = req.params.id;

        // Verificar que el artista existe
        const artist = await Artist.findById(artistId);
        if (!artist) {
            res.status(404).json({
                success: false,
                message: 'Artista no encontrado'
            });
            return;
        }

        // Estadísticas generales
        const totalStats = await Purchase.aggregate([
            { $match: { seller: new mongoose.Types.ObjectId(artistId), status: 'completed' } },
            { $group: {
                    _id: null,
                    totalSales: { $sum: 1 },
                    totalRevenue: { $sum: '$price' },
                    averagePrice: { $avg: '$price' }
                }}
        ]);

        // Estadísticas por mes
        const monthlyStats = await Purchase.aggregate([
            { $match: { seller: new mongoose.Types.ObjectId(artistId), status: 'completed' } },
            { $group: {
                    _id: {
                        year: { $year: '$purchase_date' },
                        month: { $month: '$purchase_date' }
                    },
                    sales: { $sum: 1 },
                    revenue: { $sum: '$price' }
                }},
            { $sort: { '_id.year': -1, '_id.month': -1 } }
        ]);

        // Estadísticas por tipo (canción vs álbum)
        const typeStats = await Purchase.aggregate([
            { $match: { seller: new mongoose.Types.ObjectId(artistId), status: 'completed' } },
            { $group: {
                    _id: {
                        type: {
                            $cond: {
                                if: { $ifNull: ['$song', false] },
                                then: 'song',
                                else: 'album'
                            }
                        }
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: '$price' }
                }}
        ]);

        res.status(200).json({
            success: true,
            data: {
                total: totalStats.length > 0 ? totalStats[0] : { totalSales: 0, totalRevenue: 0, averagePrice: 0 },
                monthly: monthlyStats,
                byType: typeStats
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de compras:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas de compras',
            error: (error as Error).message
        });
    }
};

// Obtener historial de compras de un usuario
export const getUserPurchaseHistory = async (req: Request, res: Response): Promise<void> => {
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

        // Obtener todas las compras del usuario
        const purchases = await Purchase.find({ client: userId })
            .populate('seller', 'artist_name')
            .populate('song', 'name url_image')
            .populate('album', 'name url_image')
            .sort({ purchase_date: -1 });

        res.status(200).json({
            success: true,
            count: purchases.length,
            data: purchases
        });
    } catch (error) {
        console.error('Error al obtener historial de compras:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener historial de compras',
            error: (error as Error).message
        });
    }
};