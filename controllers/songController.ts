import { Request, Response } from 'express';
import Song from '../models/Song';
import ArtistSong from '../models/ArtistSong';
import Reproduction from '../models/Reproduction';

// Crear una nueva canción
export const createSong = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            name,
            publish_date,
            genre,
            description,
            url_image,
            duration,
            url_song,
            format,
            url_download,
            album,
            artists // Array de IDs de artistas
        } = req.body;

        // Crear la canción
        const song = new Song({
            name,
            publish_date,
            genre,
            description,
            url_image,
            duration,
            url_song,
            format,
            url_download,
            album,
            reproductions: 0
        });

        const savedSong = await song.save();

        // Si se proporcionaron artistas, crear las relaciones
        if (artists && artists.length > 0) {
            const artistSongPromises = artists.map((artistId: string) => {
                const artistSong = new ArtistSong({
                    artist: artistId,
                    song: savedSong._id
                });
                return artistSong.save();
            });

            await Promise.all(artistSongPromises);
        }

        res.status(201).json({
            success: true,
            message: 'Canción creada exitosamente',
            data: savedSong
        });
    } catch (error) {
        console.error('Error al crear canción:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear canción',
            error: (error as Error).message
        });
    }
};

// Obtener todas las canciones
export const getSongs = async (req: Request, res: Response): Promise<void> => {
    try {
        const { genre, album, artist } = req.query;
        let query: any = {};

        if (genre) {
            query.genre = genre;
        }

        if (album) {
            query.album = album;
        }

        let songs;

        if (artist) {
            // Buscar canciones por artista
            const artistSongs = await ArtistSong.find({ artist }).populate('song');
            songs = artistSongs.map(as => as.song);
        } else {
            // Buscar canciones por filtros
            songs = await Song.find(query)
                .populate('genre', 'genre')
                .populate('format', 'format')
                .populate('album', 'name');
        }

        res.status(200).json({
            success: true,
            count: songs.length,
            data: songs
        });
    } catch (error) {
        console.error('Error al obtener canciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener canciones',
            error: (error as Error).message
        });
    }
};

// Obtener una canción por ID
export const getSongById = async (req: Request, res: Response): Promise<void> => {
    try {
        const songId = req.params.id;

        const song = await Song.findById(songId)
            .populate('genre', 'genre')
            .populate('format', 'format')
            .populate('album', 'name');

        if (!song) {
            res.status(404).json({
                success: false,
                message: 'Canción no encontrada'
            });
            return;
        }

        // Obtener los artistas relacionados
        const artistSongs = await ArtistSong.find({ song: songId }).populate('artist');
        const artists = artistSongs.map(as => as.artist);

        res.status(200).json({
            success: true,
            data: {
                song,
                artists
            }
        });
    } catch (error) {
        console.error('Error al obtener canción:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener canción',
            error: (error as Error).message
        });
    }
};

// Actualizar una canción
export const updateSong = async (req: Request, res: Response): Promise<void> => {
    try {
        const songId = req.params.id;
        const {
            name,
            publish_date,
            genre,
            description,
            url_image,
            duration,
            url_song,
            format,
            url_download,
            album
        } = req.body;

        // Verificar que la canción existe
        const song = await Song.findById(songId);
        if (!song) {
            res.status(404).json({
                success: false,
                message: 'Canción no encontrada'
            });
            return;
        }

        // Actualizar la canción
        const updatedSong = await Song.findByIdAndUpdate(
            songId,
            {
                name,
                publish_date,
                genre,
                description,
                url_image,
                duration,
                url_song,
                format,
                url_download,
                album
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Canción actualizada exitosamente',
            data: updatedSong
        });
    } catch (error) {
        console.error('Error al actualizar canción:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar canción',
            error: (error as Error).message
        });
    }
};

// Eliminar una canción
export const deleteSong = async (req: Request, res: Response): Promise<void> => {
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

        // Eliminar las relaciones
        await ArtistSong.deleteMany({ song: songId });

        // Eliminar la canción
        await Song.findByIdAndDelete(songId);

        res.status(200).json({
            success: true,
            message: 'Canción eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar canción:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar canción',
            error: (error as Error).message
        });
    }
};

// Registrar reproducción de una canción
export const addReproduction = async (req: Request, res: Response): Promise<void> => {
    try {
        const songId = req.params.id;
        const userId = req.body.userId; // Este userId tendría que venir de alguna parte (autenticación, cuerpo de la petición, etc.)

        // Verificar que la canción existe
        const song = await Song.findById(songId);
        if (!song) {
            res.status(404).json({
                success: false,
                message: 'Canción no encontrada'
            });
            return;
        }

        // Incrementar contador de reproducciones
        await Song.findByIdAndUpdate(songId, {
            $inc: { reproductions: 1 }
        });

        // Registrar reproducción
        const reproduction = new Reproduction({
            user: userId,
            song: songId
        });

        await reproduction.save();

        res.status(200).json({
            success: true,
            message: 'Reproducción registrada exitosamente'
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