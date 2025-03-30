import { Request, Response } from 'express';
import Genre from '../models/Genre';
import Song from '../models/Song';
import Album from '../models/Album';

// Crear un nuevo género
export const createGenre = async (req: Request, res: Response): Promise<void> => {
    try {
        const { genre } = req.body;

        // Verificar si el género ya existe
        const existingGenre = await Genre.findOne({ genre: { $regex: new RegExp(`^${genre}$`, 'i') } });
        if (existingGenre) {
            res.status(400).json({
                success: false,
                message: 'El género ya existe'
            });
            return;
        }

        // Crear nuevo género
        const newGenre = new Genre({
            genre
        });

        const savedGenre = await newGenre.save();

        res.status(201).json({
            success: true,
            message: 'Género creado exitosamente',
            data: savedGenre
        });
    } catch (error) {
        console.error('Error al crear género:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear género',
            error: (error as Error).message
        });
    }
};

// Obtener todos los géneros
export const getGenres = async (_req: Request, res: Response): Promise<void> => {
    try {
        const genres = await Genre.find().sort({ genre: 1 });

        res.status(200).json({
            success: true,
            count: genres.length,
            data: genres
        });
    } catch (error) {
        console.error('Error al obtener géneros:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener géneros',
            error: (error as Error).message
        });
    }
};

// Obtener un género por ID
export const getGenreById = async (req: Request, res: Response): Promise<void> => {
    try {
        const genreId = req.params.id;

        const genre = await Genre.findById(genreId);
        if (!genre) {
            res.status(404).json({
                success: false,
                message: 'Género no encontrado'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: genre
        });
    } catch (error) {
        console.error('Error al obtener género:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener género',
            error: (error as Error).message
        });
    }
};

// Actualizar un género
export const updateGenre = async (req: Request, res: Response): Promise<void> => {
    try {
        const genreId = req.params.id;
        const { genre } = req.body;

        // Verificar que el género existe
        const existingGenre = await Genre.findById(genreId);
        if (!existingGenre) {
            res.status(404).json({
                success: false,
                message: 'Género no encontrado'
            });
            return;
        }

        // Verificar si ya existe un género con el mismo nombre
        const duplicateGenre = await Genre.findOne({
            genre: { $regex: new RegExp(`^${genre}$`, 'i') },
            _id: { $ne: genreId }
        });

        if (duplicateGenre) {
            res.status(400).json({
                success: false,
                message: 'Ya existe un género con ese nombre'
            });
            return;
        }

        // Actualizar género
        const updatedGenre = await Genre.findByIdAndUpdate(
            genreId,
            { genre },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Género actualizado exitosamente',
            data: updatedGenre
        });
    } catch (error) {
        console.error('Error al actualizar género:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar género',
            error: (error as Error).message
        });
    }
};

// Eliminar un género
export const deleteGenre = async (req: Request, res: Response): Promise<void> => {
    try {
        const genreId = req.params.id;

        // Verificar que el género existe
        const genre = await Genre.findById(genreId);
        if (!genre) {
            res.status(404).json({
                success: false,
                message: 'Género no encontrado'
            });
            return;
        }

        // Verificar si hay canciones o álbumes asociados a este género
        const songsCount = await Song.countDocuments({ genre: genreId });
        const albumsCount = await Album.countDocuments({ genre: genreId });

        if (songsCount > 0 || albumsCount > 0) {
            res.status(400).json({
                success: false,
                message: 'No se puede eliminar el género porque está asociado a canciones o álbumes'
            });
            return;
        }

        await Genre.findByIdAndDelete(genreId);

        res.status(200).json({
            success: true,
            message: 'Género eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar género:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar género',
            error: (error as Error).message
        });
    }
};

// Obtener canciones por género
export const getSongsByGenre = async (req: Request, res: Response): Promise<void> => {
    try {
        const genreId = req.params.id;

        // Verificar que el género existe
        const genre = await Genre.findById(genreId);
        if (!genre) {
            res.status(404).json({
                success: false,
                message: 'Género no encontrado'
            });
            return;
        }

        // Buscar canciones del género
        const songs = await Song.find({ genre: genreId })
            .populate('format', 'format')
            .populate('album', 'name');

        res.status(200).json({
            success: true,
            count: songs.length,
            data: songs
        });
    } catch (error) {
        console.error('Error al obtener canciones por género:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener canciones por género',
            error: (error as Error).message
        });
    }
};

// Obtener álbumes por género
export const getAlbumsByGenre = async (req: Request, res: Response): Promise<void> => {
    try {
        const genreId = req.params.id;

        // Verificar que el género existe
        const genre = await Genre.findById(genreId);
        if (!genre) {
            res.status(404).json({
                success: false,
                message: 'Género no encontrado'
            });
            return;
        }

        // Buscar álbumes del género
        const albums = await Album.find({ genre: genreId })
            .populate('format', 'format');

        res.status(200).json({
            success: true,
            count: albums.length,
            data: albums
        });
    } catch (error) {
        console.error('Error al obtener álbumes por género:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener álbumes por género',
            error: (error as Error).message
        });
    }
};