import { Request, Response } from 'express';
import Format from '../models/Format';
import Song from '../models/Song';
import Album from '../models/Album';

// Crear un nuevo formato
export const createFormat = async (req: Request, res: Response): Promise<void> => {
    try {
        const { format } = req.body;

        // Verificar si el formato ya existe
        const existingFormat = await Format.findOne({ format: { $regex: new RegExp(`^${format}$`, 'i') } });
        if (existingFormat) {
            res.status(400).json({
                success: false,
                message: 'El formato ya existe'
            });
            return;
        }

        // Crear nuevo formato
        const newFormat = new Format({
            format
        });

        const savedFormat = await newFormat.save();

        res.status(201).json({
            success: true,
            message: 'Formato creado exitosamente',
            data: savedFormat
        });
    } catch (error) {
        console.error('Error al crear formato:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear formato',
            error: (error as Error).message
        });
    }
};

// Obtener todos los formatos
export const getFormats = async (_req: Request, res: Response): Promise<void> => {
    try {
        const formats = await Format.find().sort({ format: 1 });

        res.status(200).json({
            success: true,
            count: formats.length,
            data: formats
        });
    } catch (error) {
        console.error('Error al obtener formatos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener formatos',
            error: (error as Error).message
        });
    }
};

// Obtener un formato por ID
export const getFormatById = async (req: Request, res: Response): Promise<void> => {
    try {
        const formatId = req.params.id;

        const format = await Format.findById(formatId);
        if (!format) {
            res.status(404).json({
                success: false,
                message: 'Formato no encontrado'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: format
        });
    } catch (error) {
        console.error('Error al obtener formato:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener formato',
            error: (error as Error).message
        });
    }
};

// Actualizar un formato
export const updateFormat = async (req: Request, res: Response): Promise<void> => {
    try {
        const formatId = req.params.id;
        const { format } = req.body;

        // Verificar que el formato existe
        const existingFormat = await Format.findById(formatId);
        if (!existingFormat) {
            res.status(404).json({
                success: false,
                message: 'Formato no encontrado'
            });
            return;
        }

        // Verificar si ya existe un formato con el mismo nombre
        const duplicateFormat = await Format.findOne({
            format: { $regex: new RegExp(`^${format}$`, 'i') },
            _id: { $ne: formatId }
        });

        if (duplicateFormat) {
            res.status(400).json({
                success: false,
                message: 'Ya existe un formato con ese nombre'
            });
            return;
        }

        // Actualizar formato
        const updatedFormat = await Format.findByIdAndUpdate(
            formatId,
            { format },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Formato actualizado exitosamente',
            data: updatedFormat
        });
    } catch (error) {
        console.error('Error al actualizar formato:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar formato',
            error: (error as Error).message
        });
    }
};

// Eliminar un formato
export const deleteFormat = async (req: Request, res: Response): Promise<void> => {
    try {
        const formatId = req.params.id;

        // Verificar que el formato existe
        const format = await Format.findById(formatId);
        if (!format) {
            res.status(404).json({
                success: false,
                message: 'Formato no encontrado'
            });
            return;
        }

        // Verificar si hay canciones o álbumes asociados a este formato
        const songsCount = await Song.countDocuments({ format: formatId });
        const albumsCount = await Album.countDocuments({ format: formatId });

        if (songsCount > 0 || albumsCount > 0) {
            res.status(400).json({
                success: false,
                message: 'No se puede eliminar el formato porque está asociado a canciones o álbumes'
            });
            return;
        }

        await Format.findByIdAndDelete(formatId);

        res.status(200).json({
            success: true,
            message: 'Formato eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar formato:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar formato',
            error: (error as Error).message
        });
    }
};

// Obtener canciones por formato
export const getSongsByFormat = async (req: Request, res: Response): Promise<void> => {
    try {
        const formatId = req.params.id;

        // Verificar que el formato existe
        const format = await Format.findById(formatId);
        if (!format) {
            res.status(404).json({
                success: false,
                message: 'Formato no encontrado'
            });
            return;
        }

        // Buscar canciones del formato
        const songs = await Song.find({ format: formatId })
            .populate('genre', 'genre')
            .populate('album', 'name');

        res.status(200).json({
            success: true,
            count: songs.length,
            data: songs
        });
    } catch (error) {
        console.error('Error al obtener canciones por formato:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener canciones por formato',
            error: (error as Error).message
        });
    }
};

// Obtener álbumes por formato
export const getAlbumsByFormat = async (req: Request, res: Response): Promise<void> => {
    try {
        const formatId = req.params.id;

        // Verificar que el formato existe
        const format = await Format.findById(formatId);
        if (!format) {
            res.status(404).json({
                success: false,
                message: 'Formato no encontrado'
            });
            return;
        }

        // Buscar álbumes del formato
        const albums = await Album.find({ format: formatId })
            .populate('genre', 'genre');

        res.status(200).json({
            success: true,
            count: albums.length,
            data: albums
        });
    } catch (error) {
        console.error('Error al obtener álbumes por formato:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener álbumes por formato',
            error: (error as Error).message
        });
    }
};