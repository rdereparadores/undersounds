import { Album } from '../models/Album';
import { ApiError } from '../utils/ApiError';
import { Types } from 'mongoose';

export class AlbumDAO {
    async findById(id: string) {
        try {
            return await Album.findById(id);
        } catch (error) {
            throw new ApiError(500, 'Error retrieving album');
        }
    }

    async findByIdWithDetails(id: string) {
        try {
            return await Album.findById(id)
                .populate({
                    path: 'track_list',
                    populate: [
                        { path: 'author', model: 'artist' },
                        {
                            path: 'collaborators',
                            populate: {
                                path: 'artist',
                                model: 'artist'
                            }
                        },
                        { path: 'genres' }
                    ]
                });
        } catch (error) {
            throw new ApiError(500, 'Error retrieving album with details');
        }
    }

    async findByGenrePaginated(genreId: string, skip: number, limit: number) {
        try {
            // Buscar canciones con el género y extraer sus IDs
            const songIds = await Song.find({ genres: genreId })
                .select('_id')
                .lean();

            // Buscar álbumes que contengan esas canciones
            return await Album.find({ track_list: { $in: songIds.map(song => song._id) } })
                .skip(skip)
                .limit(limit);
        } catch (error) {
            throw new ApiError(500, 'Error retrieving albums by genre');
        }
    }

    async countByGenre(genreId: string): Promise<number> {
        try {
            // Similar approach to find albums containing songs with the specific genre
            const songIds = await Song.find({ genres: genreId })
                .select('_id')
                .lean();

            return await Album.countDocuments({ track_list: { $in: songIds.map(song => song._id) } });
        } catch (error) {
            throw new ApiError(500, 'Error counting albums by genre');
        }
    }

    async findRecommendations(albumId: string, limit: number) {
        try {
            const album = await Album.findById(albumId);
            if (!album) {
                throw new ApiError(404, 'Album not found');
            }

            // Obtener las canciones del álbum para extraer géneros
            const songs = await Song.find({ _id: { $in: album.track_list } });
            const genres = new Set();

            // Recopilar todos los géneros de las canciones
            for (const song of songs) {
                song.genres.forEach(genre => genres.add(genre.toString()));
            }

            // Buscar canciones similares
            const similarSongs = await Song.find({
                genres: { $in: Array.from(genres) },
                _id: { $nin: album.track_list }
            }).select('_id');

            // Buscar álbumes que contengan estas canciones similares
            return await Album.find({
                _id: { $ne: albumId },
                track_list: { $in: similarSongs.map(song => song._id) }
            })
                .limit(limit);
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, 'Error finding album recommendations');
        }
    }

    async findAll() {
        try {
            return await Album.find();
        } catch (error) {
            throw new ApiError(500, 'Error retrieving albums');
        }
    }

    async create(albumData: any) {
        try {
            const album = new Album(albumData);
            return await album.save();
        } catch (error) {
            throw new ApiError(500, 'Error creating album');
        }
    }

    async update(id: string, albumData: any) {
        try {
            return await Album.findByIdAndUpdate(
                id,
                { $set: albumData },
                { new: true }
            );
        } catch (error) {
            throw new ApiError(500, 'Error updating album');
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await Album.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            throw new ApiError(500, 'Error deleting album');
        }
    }

    async addTrack(albumId: string, songId: string) {
        try {
            return await Album.findByIdAndUpdate(
                albumId,
                { $addToSet: { track_list: songId } },
                { new: true }
            );
        } catch (error) {
            throw new ApiError(500, 'Error adding track to album');
        }
    }

    async removeTrack(albumId: string, songId: string) {
        try {
            return await Album.findByIdAndUpdate(
                albumId,
                { $pull: { track_list: songId } },
                { new: true }
            );
        } catch (error) {
            throw new ApiError(500, 'Error removing track from album');
        }
    }
}

// Para referencia - importando Song si es necesario
import { Song } from '../models/Song';