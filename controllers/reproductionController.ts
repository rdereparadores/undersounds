import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Reproduction from '../models/Reproduction';
import Song from '../models/Song';
import User from '../models/User';

// Registrar una reproducción
export const createReproduction = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user, song } = req.body;

        // Verificar que el usuario existe
        const userExists = await User.findById(user);
        if (!userExists) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }

        // Verificar que la canción existe
        const songExists = await Song.findById(song);
        if (!songExists) {
            res.status(404).json({
                success: false,
                message: 'Canción no encontrada'
            });
            return;
        }

        // Crear nueva reproducción
        const reproduction = new Reproduction({
            user,
            song
        });

        const savedReproduction = await reproduction.save();

        // Incrementar el contador de reproducciones de la canción
        await Song.findByIdAndUpdate(song, {
            $inc: { reproductions: 1 }
        });

        res.status(201).json({
            success: true,
            message: 'Reproducción registrada exitosamente',
            data: savedReproduction
        });
    } catch (error) {
        console.error('Error al registrar reproducción:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar reproducción',
            error: (error as Error).message
        });
    }
};

// Obtener todas las reproducciones
export const getReproductions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user, song, startDate, endDate } = req.query;
        let query: any = {};

        if (user) {
            query.user = user;
        }

        if (song) {
            query.song = song;
        }

        // Filtrar por rango de fechas
        if (startDate || endDate) {
            query.createdAt = {};

            if (startDate) {
                query.createdAt.$gte = new Date(startDate as string);
            }

            if (endDate) {
                query.createdAt.$lte = new Date(endDate as string);
            }
        }

        const reproductions = await Reproduction.find(query)
            .populate('user', 'name')
            .populate('song', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reproductions.length,
            data: reproductions
        });
    } catch (error) {
        console.error('Error al obtener reproducciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener reproducciones',
            error: (error as Error).message
        });
    }
};

// Obtener reproducciones de un usuario
export const getUserReproductions = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;

        // Verificar que el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }

        const reproductions = await Reproduction.find({ user: userId })
            .populate('song', 'name url_image duration artist')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reproductions.length,
            data: reproductions
        });
    } catch (error) {
        console.error('Error al obtener reproducciones del usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener reproducciones del usuario',
            error: (error as Error).message
        });
    }
};

// Obtener reproducciones de una canción
export const getSongReproductions = async (req: Request, res: Response): Promise<void> => {
    try {
        const songId = req.params.songId;

        // Verificar que la canción existe
        const song = await Song.findById(songId);
        if (!song) {
            res.status(404).json({
                success: false,
                message: 'Canción no encontrada'
            });
            return;
        }

        const reproductions = await Reproduction.find({ song: songId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reproductions.length,
            data: reproductions
        });
    } catch (error) {
        console.error('Error al obtener reproducciones de la canción:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener reproducciones de la canción',
            error: (error as Error).message
        });
    }
};

// Obtener estadísticas de reproducciones
export const getReproductionStats = async (req: Request, res: Response): Promise<void> => {
    try {
        // Estadísticas generales
        const totalCount = await Reproduction.countDocuments();

        // Reproducciones por día (últimos 30 días)
        const dailyStats = await Reproduction.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        // Top 10 canciones más reproducidas
        const topSongs = await Reproduction.aggregate([
            {
                $group: {
                    _id: "$song",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "songs",
                    localField: "_id",
                    foreignField: "_id",
                    as: "songDetails"
                }
            },
            { $unwind: "$songDetails" },
            {
                $project: {
                    _id: 1,
                    name: "$songDetails.name",
                    count: 1
                }
            }
        ]);

        // Top 10 usuarios con más reproducciones
        const topUsers = await Reproduction.aggregate([
            {
                $group: {
                    _id: "$user",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $project: {
                    _id: 1,
                    name: "$userDetails.name",
                    count: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalReproductions: totalCount,
                dailyStats,
                topSongs,
                topUsers
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de reproducciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas de reproducciones',
            error: (error as Error).message
        });
    }
};

// Eliminar una reproducción
export const deleteReproduction = async (req: Request, res: Response): Promise<void> => {
    try {
        const reproductionId = req.params.id;

        // Verificar que la reproducción existe
        const reproduction = await Reproduction.findById(reproductionId);
        if (!reproduction) {
            res.status(404).json({
                success: false,
                message: 'Reproducción no encontrada'
            });
            return;
        }

        // Decrementar el contador de reproducciones de la canción
        await Song.findByIdAndUpdate(reproduction.song, {
            $inc: { reproductions: -1 }
        });

        await Reproduction.findByIdAndDelete(reproductionId);

        res.status(200).json({
            success: true,
            message: 'Reproducción eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar reproducción:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar reproducción',
            error: (error as Error).message
        });
    }
};