// src/controllers/artistController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Artist from '../models/Artist';
import ArtistSong from '../models/ArtistSong';
import ArtistAlbum from '../models/ArtistAlbum';
import { checkArtistDuplicates } from './utils/artistCheck';
import Song from '../models/Song';
import Album from '../models/Album';

// Crear un nuevo artista
export const createArtist = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            artist_name,
            real_name,
            birth_date,
            email,
            password,
            record_label,
            address,
            bank_account
        } = req.body;

        //Comprueba que el email y el nombre artístico no existan
        const { exists, message } = await checkArtistDuplicates(email, artist_name);

        if(exists){
            res.status(400).json(
                {
                    success: false,
                    message
                }
            )
            return;
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear nuevo artista
        const artist = new Artist({
            artist_name,
            real_name,
            birth_date,
            email,
            password: hashedPassword,
            record_label,
            address,
            bank_account
        });

        const savedArtist = await artist.save();

        // Excluir la contraseña en la respuesta
        const artistResponse = savedArtist.toObject();
        const { password: _, ...artistWithoutPassword } = artistResponse;

        res.status(201).json({
            success: true,
            message: 'Artista creado exitosamente',
            data: artistWithoutPassword
        });
    } catch (error) {
        console.error('Error al crear artista:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear artista',
            error: (error as Error).message
        });
    }
};

// Obtener todos los artistas
export const getArtists = async (_req: Request, res: Response): Promise<void> => {
    try {
        const artists = await Artist.find().select('-password');

        res.status(200).json({
            success: true,
            count: artists.length,
            data: artists
        });
    } catch (error) {
        console.error('Error al obtener artistas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener artistas',
            error: (error as Error).message
        });
    }
};

// Obtener un artista por ID
export const getArtistById = async (req: Request, res: Response): Promise<void> => {
    try {
        const artistId = req.params.id;

        const artist = await Artist.findById(artistId).select('-password');
        if (!artist) {
            res.status(404).json({
                success: false,
                message: 'Artista no encontrado'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: artist
        });
    } catch (error) {
        console.error('Error al obtener artista:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener artista',
            error: (error as Error).message
        });
    }
};

// Actualizar un artista
export const updateArtist = async (req: Request, res: Response): Promise<void> => {
    try {
        const artistId = req.params.id;
        const {
            artist_name,
            real_name,
            birth_date,
            email,
            record_label,
            bank_account
        } = req.body;

        // Verificar que el artista existe
        const artist = await Artist.findById(artistId);
        if (!artist) {
            res.status(404).json({
                success: false,
                message: 'Artista no encontrado'
            });
            return;
        }

        const { exists, message } = await checkArtistDuplicates(email, artist_name, artistId);

        if(exists){
            res.status(400).json({
                success: false,
                message
            });
            return;
        }

        // Actualizar artista
        const updatedArtist = await Artist.findByIdAndUpdate(
            artistId,
            {
                artist_name,
                real_name,
                birth_date,
                email,
                record_label,
                bank_account
            },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'Artista actualizado exitosamente',
            data: updatedArtist
        });
    } catch (error) {
        console.error('Error al actualizar artista:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar artista',
            error: (error as Error).message
        });
    }
};

// Eliminar un artista
export const deleteArtist = async (req: Request, res: Response): Promise<void> => {
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

        // Verificar si tiene canciones o álbumes asociados
        const songsCount = await ArtistSong.countDocuments({ artist: artistId });
        const albumsCount = await ArtistAlbum.countDocuments({ artist: artistId });

        if (songsCount > 0 || albumsCount > 0) {
            res.status(400).json({
                success: false,
                message: 'No se puede eliminar el artista porque tiene canciones o álbumes asociados'
            });
            return;
        }

        await Artist.findByIdAndDelete(artistId);

        res.status(200).json({
            success: true,
            message: 'Artista eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar artista:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar artista',
            error: (error as Error).message
        });
    }
};

// Obtener canciones de un artista
export const getArtistSongs = async (req: Request, res: Response): Promise<void> => {
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

        // Obtener las relaciones artista-canción
        const artistSongs = await ArtistSong.find({ artist: artistId }).populate({
            path: 'song',
            populate: [
                { path: 'genre', select: 'genre' },
                { path: 'format', select: 'format' },
                { path: 'album', select: 'name' }
            ]
        });

        const songs = artistSongs.map(as => as.song);

        res.status(200).json({
            success: true,
            count: songs.length,
            data: songs
        });
    } catch (error) {
        console.error('Error al obtener canciones del artista:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener canciones del artista',
            error: (error as Error).message
        });
    }
};

// Obtener álbumes de un artista
export const getArtistAlbums = async (req: Request, res: Response): Promise<void> => {
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

        // Obtener las relaciones artista-álbum
        const artistAlbums = await ArtistAlbum.find({ artist: artistId }).populate({
            path: 'album',
            populate: [
                { path: 'genre', select: 'genre' },
                { path: 'format', select: 'format' }
            ]
        });

        const albums = artistAlbums.map(aa => aa.album);

        res.status(200).json({
            success: true,
            count: albums.length,
            data: albums
        });
    } catch (error) {
        console.error('Error al obtener álbumes del artista:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener álbumes del artista',
            error: (error as Error).message
        });
    }
};