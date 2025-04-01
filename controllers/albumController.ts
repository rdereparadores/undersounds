import { Request, Response } from 'express';
import Album from '../models/Album';
import ArtistAlbum from '../models/ArtistAlbum';
import Artist from '../models/Artist';
import Song from '../models/Song';

// Crear un nuevo álbum
export const createAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            name,
            publish_date,
            genre,
            description,
            url_image,
            format,
            url_download,
            artists // Array de IDs de artistas
        } = req.body;

        // Se comprueba que el artista o artistas existen
        const existingArtists = await Artist.find({ _id: { $in: artists } });
        if (existingArtists.length !== artists.length) {
            res.status(400).json({
                success: false,
                message: 'Uno o más artistas no existen'
            });
            return;
        }

        // Crear el álbum
        const album = new Album({
            name,
            publish_date,
            genre,
            description,
            url_image,
            format,
            url_download
        });

        const savedAlbum = await album.save();

        // Si se proporcionaron artistas, crear las relaciones
        if (artists && artists.length > 0) {
            const artistAlbumPromises = artists.map((artistId: string) => {
                const artistAlbum = new ArtistAlbum({
                    artist: artistId,
                    album: savedAlbum._id
                });
                return artistAlbum.save();
            });

            await Promise.all(artistAlbumPromises);
        }

        res.status(201).json({
            success: true,
            message: 'Álbum creado exitosamente',
            data: savedAlbum
        });
    } catch (error) {
        console.error('Error al crear álbum:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear álbum',
            error: (error as Error).message
        });
    }
};

// Obtener todos los álbumes
export const getAlbums = async (req: Request, res: Response): Promise<void> => {
    try {
        const { genre, artist } = req.query;
        let query: any = {};

        if (genre) {
            query.genre = genre;
        }

        let albums;

        if (artist) {
            // Buscar álbumes por artista
            const artistAlbums = await ArtistAlbum.find({ artist }).populate('album');
            albums = artistAlbums.map(aa => aa.album);
        } else {
            // Buscar álbumes por filtros
            albums = await Album.find(query)
                .populate('genre', 'genre')
                .populate('format', 'format');
        }

        res.status(200).json({
            success: true,
            count: albums.length,
            data: albums
        });
    } catch (error) {
        console.error('Error al obtener álbumes:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener álbumes',
            error: (error as Error).message
        });
    }
};

// Obtener un álbum por ID
export const getAlbumById = async (req: Request, res: Response): Promise<void> => {
    try {
        const albumId = req.params.id;

        const album = await Album.findById(albumId)
            .populate('genre', 'genre')
            .populate('format', 'format');

        if (!album) {
            res.status(404).json({
                success: false,
                message: 'Álbum no encontrado'
            });
            return;
        }

        // Obtener los artistas relacionados
        const artistAlbums = await ArtistAlbum.find({ album: albumId }).populate('artist');
        const artists = artistAlbums.map(aa => aa.artist);

        // Obtener las canciones del álbum
        const songs = await Song.find({ album: albumId });

        res.status(200).json({
            success: true,
            data: {
                album,
                artists,
                songs
            }
        });
    } catch (error) {
        console.error('Error al obtener álbum:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener álbum',
            error: (error as Error).message
        });
    }
};

// Actualizar un álbum
export const updateAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
        const albumId = req.params.id;
        const {
            name,
            publish_date,
            genre,
            description,
            url_image,
            format,
            url_download
        } = req.body;

        // Verificar que el álbum existe
        const album = await Album.findById(albumId);
        if (!album) {
            res.status(404).json({
                success: false,
                message: 'Álbum no encontrado'
            });
            return;
        }

        // Actualizar el álbum
        const updatedAlbum = await Album.findByIdAndUpdate(
            albumId,
            {
                name,
                publish_date,
                genre,
                description,
                url_image,
                format,
                url_download
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Álbum actualizado exitosamente',
            data: updatedAlbum
        });
    } catch (error) {
        console.error('Error al actualizar álbum:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar álbum',
            error: (error as Error).message
        });
    }
};

// Eliminar un álbum
export const deleteAlbum = async (req: Request, res: Response): Promise<void> => {
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

        // Verificar si hay canciones asociadas
        const songsCount = await Song.countDocuments({ album: albumId });
        if (songsCount > 0) {
            res.status(400).json({
                success: false,
                message: 'No se puede eliminar el álbum porque tiene canciones asociadas'
            });
            return;
        }

        // Eliminar las relaciones
        await ArtistAlbum.deleteMany({ album: albumId });

        // Eliminar el álbum
        await Album.findByIdAndDelete(albumId);

        res.status(200).json({
            success: true,
            message: 'Álbum eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar álbum:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar álbum',
            error: (error as Error).message
        });
    }
};

// Agregar canciones a un álbum
export const addSongsToAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
        const albumId = req.params.id;
        const { songIds } = req.body; // Array de IDs de canciones

        // Verificar que el álbum existe
        const album = await Album.findById(albumId);
        if (!album) {
            res.status(404).json({
                success: false,
                message: 'Álbum no encontrado'
            });
            return;
        }

        // Actualizar las canciones con el ID del álbum
        const updatePromises = songIds.map((songId: string) => {
            return Song.findByIdAndUpdate(songId, { album: albumId });
        });

        await Promise.all(updatePromises);

        res.status(200).json({
            success: true,
            message: 'Canciones agregadas al álbum exitosamente'
        });
    } catch (error) {
        console.error('Error al agregar canciones al álbum:', error);
        res.status(500).json({
            success: false,
            message: 'Error al agregar canciones al álbum',
            error: (error as Error).message
        });
    }
};