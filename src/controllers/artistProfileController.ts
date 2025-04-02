import { Request, Response } from 'express';
import mongoose from 'mongoose';
import UserAuth from '../models/UserAuth';
import Follow from '../models/Follow';
import Song from '../models/Song'; // Importar el modelo de Song
import ArtistSong from '../models/ArtistSong';
import PlayHistory from '../models/PlayHistory';
import OrderItem from '../models/OrderItem';
import Order from '../models/Order';
import ProductArtist from "../models/ProductArtist";

// Obtener perfil de artista
export const getArtistProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const artistId = req.params.id;
        const userId = req.query.userId as string || null;

        // Buscar usuario con rol de artista
        const artist = await UserAuth.findOne({
            _id: artistId,
            role: 'artist'
        }).select('-password');

        if (!artist) {
            res.status(404).json({
                success: false,
                message: 'Artista no encontrado'
            });
            return;
        }

        // Contar seguidores
        const followersCount = await Follow.countDocuments({ artist_id: artistId });

        // Verificar si el usuario solicitante sigue al artista
        let isFollowing = false;
        if (userId) {
            const followRecord = await Follow.findOne({
                user_id: userId,
                artist_id: artistId
            });
            isFollowing = !!followRecord;
        }

        res.status(200).json({
            success: true,
            data: {
                ...artist.toObject(),
                followers: followersCount,
                is_following: isFollowing
            }
        });
    } catch (error: any) {
        console.error('Error al obtener perfil de artista:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener perfil de artista',
            error: error.message
        });
    }
};

// Seguir/dejar de seguir artista
export const toggleFollowArtist = async (req: Request, res: Response): Promise<void> => {
    try {
        const artistId = req.params.id;
        const userId = req.body.userId;

        // Verificar que el artista existe
        const artist = await UserAuth.findOne({
            _id: artistId,
            role: 'artist'
        });

        if (!artist) {
            res.status(404).json({
                success: false,
                message: 'Artista no encontrado'
            });
            return;
        }

        // Verificar si ya sigue al artista
        const existingFollow = await Follow.findOne({
            user_id: userId,
            artist_id: artistId
        });

        if (existingFollow) {
            // Si ya lo sigue, dejar de seguir
            await Follow.findByIdAndDelete(existingFollow._id);

            res.status(200).json({
                success: true,
                message: 'Has dejado de seguir a este artista',
                is_following: false
            });
        } else {
            // Si no lo sigue, seguir
            const newFollow = new Follow({
                user_id: userId,
                artist_id: artistId
            });

            await newFollow.save();

            res.status(200).json({
                success: true,
                message: 'Ahora sigues a este artista',
                is_following: true
            });
        }
    } catch (error: any) {
        console.error('Error al cambiar estado de seguimiento:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cambiar estado de seguimiento',
            error: error.message
        });
    }
};

// Obtener top canciones de un artista
export const getArtistTopSongs = async (req: Request, res: Response): Promise<void> => {
    try {
        const artistId = req.params.id;
        const limit = Number(req.query.limit) || 5;

        // Verificar que el artista existe
        const artist = await UserAuth.findOne({
            _id: artistId,
            role: 'artist'
        });

        if (!artist) {
            res.status(404).json({
                success: false,
                message: 'Artista no encontrado'
            });
            return;
        }

        // Encontrar canciones del artista
        const artistSongs = await ArtistSong.find({ artist: artistId })
            .populate({
                path: 'song',
                model: 'Song'
            });

        // Filtrar canciones válidas
        const songIds = artistSongs
            .filter(as => as.song)
            .map(as => (as.song as any)._id);

        // Contar reproducciones para cada canción
        const topSongsAgg = await PlayHistory.aggregate([
            { $match: { song_id: { $in: songIds } } },
            {
                $group: {
                    _id: '$song_id',
                    play_count: { $sum: 1 }
                }
            },
            { $sort: { play_count: -1 } },
            { $limit: limit }
        ]);

        // Obtener detalles de las canciones
        const topSongs = await Promise.all(topSongsAgg.map(async (item) => {
            const song = await Song.findById(item._id);
            if (!song) return null;

            return {
                id: song._id,
                title: song.name, // Usar 'name' en lugar de 'title'
                img_url: song.url_image, // Usar 'url_image'
                duration: song.duration ?? 0, // Usar 'duration' del modelo Song
                play_count: item.play_count
            };
        }));

        // Filtrar cualquier resultado null (por si alguna canción fue eliminada)
        const validTopSongs = topSongs.filter(song => song !== null);

        res.status(200).json({
            success: true,
            data: validTopSongs
        });
    } catch (error: any) {
        console.error('Error al obtener top canciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener top canciones',
            error: error.message
        });
    }
};

// Obtener álbumes de un artista
export const getArtistAlbums = async (req: Request, res: Response): Promise<void> => {
    try {
        const artistId = req.params.id;

        // Verificar que el artista existe
        const artist = await UserAuth.findOne({
            _id: artistId,
            role: 'artist'
        });

        if (!artist) {
            res.status(404).json({
                success: false,
                message: 'Artista no encontrado'
            });
            return;
        }

        // Encontrar productos de tipo álbum del artista
        const artistAlbums = await ProductArtist.find({ artist_id: artistId })
            .populate({
                path: 'product_id',
                match: { type: 'album' },
                options: { sort: { release_date: -1 } }
            });

        // Filtrar álbumes válidos y formatear respuesta
        const albums = artistAlbums
            .filter(aa => aa.product_id)
            .map(aa => {
                const album = aa.product_id as any;
                return {
                    id: album._id,
                    title: album.title,
                    img_url: album.img_url,
                    release_date: album.release_date
                };
            });

        res.status(200).json({
            success: true,
            data: albums
        });
    } catch (error: any) {
        console.error('Error al obtener álbumes del artista:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener álbumes del artista',
            error: error.message
        });
    }
};

// Obtener último lanzamiento de un artista
export const getArtistLatestRelease = async (req: Request, res: Response): Promise<void> => {
    try {
        const artistId = req.params.id;

        // Verificar que el artista existe
        const artist = await UserAuth.findOne({
            _id: artistId,
            role: 'artist'
        });

        if (!artist) {
            res.status(404).json({
                success: false,
                message: 'Artista no encontrado'
            });
            return;
        }

        // Encontrar productos del artista, ordenados por fecha de lanzamiento
        const artistProducts = await ProductArtist.find({ artist_id: artistId })
            .populate({
                path: 'product_id',
                options: { sort: { release_date: -1 } }
            })
            .limit(1);

        if (artistProducts.length === 0 || !artistProducts[0].product_id) {
            res.status(404).json({
                success: false,
                message: 'No se encontraron lanzamientos para este artista'
            });
            return;
        }

        const latestProduct = artistProducts[0].product_id as any;

        res.status(200).json({
            success: true,
            data: {
                id: latestProduct._id,
                title: latestProduct.title,
                type: latestProduct.type,
                img_url: latestProduct.img_url,
                release_date: latestProduct.release_date
            }
        });
    } catch (error: any) {
        console.error('Error al obtener último lanzamiento:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener último lanzamiento',
            error: error.message
        });
    }
};

// Obtener estadísticas de ventas del artista
export const getArtistSalesStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const artistId = req.params.id;

        // Verificar que el artista existe y tiene permiso
        const artist = await UserAuth.findOne({
            _id: artistId,
            role: 'artist'
        });

        if (!artist) {
            res.status(404).json({
                success: false,
                message: 'Artista no encontrado'
            });
            return;
        }

        // Encontrar todos los productos del artista
        const artistProducts = await ProductArtist.find({ artist_id: artistId });
        const productIds = artistProducts.map(ap => ap.product_id);

        // Encontrar ventas de estos productos
        const orderItems = await OrderItem.find({ product_id: { $in: productIds } })
            .populate({
                path: 'order_id',
                match: { status: 'completed' }
            });

        // Filtrar solo items de órdenes completadas
        const validOrderItems = orderItems.filter(item => item.order_id);

        // Calcular ventas totales
        const totalRevenue = validOrderItems.reduce((sum, item) => {
            return sum + (item.quantity * item.unit_price);
        }, 0);

        // Calcular ventas por producto
        const salesByProduct: Record<string, {quantity: number, revenue: number}> = {};
        validOrderItems.forEach(item => {
            const productId = (item.product_id as any).toString();
            if (!salesByProduct[productId]) {
                salesByProduct[productId] = { quantity: 0, revenue: 0 };
            }
            salesByProduct[productId].quantity += item.quantity;
            salesByProduct[productId].revenue += (item.quantity * item.unit_price);
        });

        // Obtener tendencia de ventas (mes actual vs mes anterior)
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const ordersByMonth: Record<number, number> = {};

        // Agrupar ventas por mes
        for (const item of validOrderItems) {
            const order = item.order_id as any;
            const orderDate = new Date(order.createdAt);
            const month = orderDate.getMonth() + 1; // +1 porque getMonth() devuelve 0-11

            if (!ordersByMonth[month]) {
                ordersByMonth[month] = 0;
            }

            ordersByMonth[month] += (item.quantity * item.unit_price);
        }

        const currentMonth = ordersByMonth[now.getMonth() + 1] || 0;
        const previousMonth = ordersByMonth[now.getMonth() === 0 ? 12 : now.getMonth()] || 0;
        const changePercentage = previousMonth ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;

        res.status(200).json({
            success: true,
            data: {
                total_revenue: totalRevenue,
                total_sales: validOrderItems.length,
                product_sales: salesByProduct,
                monthly_trend: {
                    current_month: currentMonth,
                    previous_month: previousMonth,
                    change_percentage: changePercentage
                }
            }
        });
    } catch (error: any) {
        console.error('Error al obtener estadísticas de ventas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas de ventas',
            error: error.message
        });
    }
};