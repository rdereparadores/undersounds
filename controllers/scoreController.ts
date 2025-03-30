import { Request, Response } from 'express';
import Score from '../models/Score';
import Song from '../models/Song';
import Album from '../models/Album';
import User from '../models/User';
import mongoose from 'mongoose';

// Crear una nueva valoración
export const createScore = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user, album, song, score, opinion } = req.body;

        // Verificar que el usuario existe
        const userExists = await User.findById(user);
        if (!userExists) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }

        // Verificar que al menos se proporciona un álbum o una canción, pero no ambos
        if ((!album && !song) || (album && song)) {
            res.status(400).json({
                success: false,
                message: 'Debe proporcionar un álbum o una canción, pero no ambos'
            });
            return;
        }

        // Verificar que el álbum o la canción existen
        if (album) {
            const albumExists = await Album.findById(album);
            if (!albumExists) {
                res.status(404).json({
                    success: false,
                    message: 'Álbum no encontrado'
                });
                return;
            }

            // Verificar si el usuario ya ha valorado este álbum
            const existingScore = await Score.findOne({ user, album });
            if (existingScore) {
                res.status(400).json({
                    success: false,
                    message: 'Ya has valorado este álbum'
                });
                return;
            }
        }

        if (song) {
            const songExists = await Song.findById(song);
            if (!songExists) {
                res.status(404).json({
                    success: false,
                    message: 'Canción no encontrada'
                });
                return;
            }

            // Verificar si el usuario ya ha valorado esta canción
            const existingScore = await Score.findOne({ user, song });
            if (existingScore) {
                res.status(400).json({
                    success: false,
                    message: 'Ya has valorado esta canción'
                });
                return;
            }
        }

        // Validar que la puntuación esté entre 0 y 10
        if (score < 0 || score > 10) {
            res.status(400).json({
                success: false,
                message: 'La puntuación debe estar entre 0 y 10'
            });
            return;
        }

        // Crear nueva valoración
        const newScore = new Score({
            user,
            album,
            song,
            score,
            opinion
        });

        const savedScore = await newScore.save();

        res.status(201).json({
            success: true,
            message: 'Valoración creada exitosamente',
            data: savedScore
        });
    } catch (error) {
        console.error('Error al crear valoración:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear valoración',
            error: (error as Error).message
        });
    }
};

// Obtener todas las valoraciones
export const getScores = async (req: Request, res: Response): Promise<void> => {
    try {
        const { album, song, user } = req.query;
        let query: any = {};

        if (album) {
            query.album = album;
        }

        if (song) {
            query.song = song;
        }

        if (user) {
            query.user = user;
        }

        const scores = await Score.find(query)
            .populate('user', 'name')
            .populate('album', 'name')
            .populate('song', 'name');

        res.status(200).json({
            success: true,
            count: scores.length,
            data: scores
        });
    } catch (error) {
        console.error('Error al obtener valoraciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener valoraciones',
            error: (error as Error).message
        });
    }
};

// Obtener una valoración por ID
export const getScoreById = async (req: Request, res: Response): Promise<void> => {
    try {
        const scoreId = req.params.id;

        const score = await Score.findById(scoreId)
            .populate('user', 'name')
            .populate('album', 'name')
            .populate('song', 'name');

        if (!score) {
            res.status(404).json({
                success: false,
                message: 'Valoración no encontrada'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: score
        });
    } catch (error) {
        console.error('Error al obtener valoración:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener valoración',
            error: (error as Error).message
        });
    }
};

// Actualizar una valoración
export const updateScore = async (req: Request, res: Response): Promise<void> => {
    try {
        const scoreId = req.params.id;
        const { score, opinion } = req.body;

        // Verificar que la valoración existe
        const existingScore = await Score.findById(scoreId);
        if (!existingScore) {
            res.status(404).json({
                success: false,
                message: 'Valoración no encontrada'
            });
            return;
        }

        // Validar que la puntuación esté entre 0 y 10
        if (score < 0 || score > 10) {
            res.status(400).json({
                success: false,
                message: 'La puntuación debe estar entre 0 y 10'
            });
            return;
        }

        // Actualizar valoración
        const updatedScore = await Score.findByIdAndUpdate(
            scoreId,
            { score, opinion },
            { new: true, runValidators: true }
        )
            .populate('user', 'name')
            .populate('album', 'name')
            .populate('song', 'name');

        res.status(200).json({
            success: true,
            message: 'Valoración actualizada exitosamente',
            data: updatedScore
        });
    } catch (error) {
        console.error('Error al actualizar valoración:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar valoración',
            error: (error as Error).message
        });
    }
};

// Eliminar una valoración
export const deleteScore = async (req: Request, res: Response): Promise<void> => {
    try {
        const scoreId = req.params.id;

        // Verificar que la valoración existe
        const score = await Score.findById(scoreId);
        if (!score) {
            res.status(404).json({
                success: false,
                message: 'Valoración no encontrada'
            });
            return;
        }

        await Score.findByIdAndDelete(scoreId);

        res.status(200).json({
            success: true,
            message: 'Valoración eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar valoración:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar valoración',
            error: (error as Error).message
        });
    }
};

// Obtener el promedio de valoraciones de un álbum
export const getAlbumAverageScore = async (req: Request, res: Response): Promise<void> => {
    try {
        const albumId = req.params.id;

        // Verificar que el álbum existe
        const album = await Album.findById(albumId);
        if (!album) {
            res.status(404).json({
                success: false,
                message: 'Álbum no encontrado'
            });
            return;
        }

        // Calcular el promedio de valoraciones
        const result = await Score.aggregate([
            { $match: { album: new mongoose.Types.ObjectId(albumId) } },
            { $group: { _id: null, averageScore: { $avg: '$score' }, count: { $sum: 1 } } }
        ]);

        const averageScore = result.length > 0 ? result[0].averageScore : 0;
        const count = result.length > 0 ? result[0].count : 0;

        res.status(200).json({
            success: true,
            data: {
                album: albumId,
                averageScore,
                count
            }
        });
    } catch (error) {
        console.error('Error al obtener promedio de valoraciones del álbum:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener promedio de valoraciones del álbum',
            error: (error as Error).message
        });
    }
};

// Obtener el promedio de valoraciones de una canción
export const getSongAverageScore = async (req: Request, res: Response): Promise<void> => {
    try {
        const songId = req.params.id;

        // Verificar que la canción existe
        const song = await Song.findById(songId);
        if (!song) {
            res.status(404).json({
                success: false,
                message: 'Canción no encontrada'
            });
            return;
        }

        // Calcular el promedio de valoraciones
        const result = await Score.aggregate([
            { $match: { song: new mongoose.Types.ObjectId(songId) } },
            { $group: { _id: null, averageScore: { $avg: '$score' }, count: { $sum: 1 } } }
        ]);

        const averageScore = result.length > 0 ? result[0].averageScore : 0;
        const count = result.length > 0 ? result[0].count : 0;

        res.status(200).json({
            success: true,
            data: {
                song: songId,
                averageScore,
                count
            }
        });
    } catch (error) {
        console.error('Error al obtener promedio de valoraciones de la canción:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener promedio de valoraciones de la canción',
            error: (error as Error).message
        });
    }
};