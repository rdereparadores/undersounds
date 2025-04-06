import { Song } from '../models/Song';
import { ApiError } from '../utils/ApiError';
import { Types } from 'mongoose';

export class SongDAO {
    async findById(id: string) {
        try {
            return await Song.findById(id);
        } catch (error) {
            throw new ApiError(500, 'Error retrieving song');
        }
    }

    async findByIdWithDetails(id: string) {
        try {
            return await Song.findById(id)
                .populate('author')
                .populate({
                    path: 'collaborators',
                    populate: {
                        path: 'artist',
                        model: 'artist'
                    }
                })
                .populate('genres');
        } catch (error) {
            throw new ApiError(500, 'Error retrieving song with details');
        }
    }

    async findMostPlayed(limit: number) {
        try {
            return await Song.find()
                .sort({ plays: -1 })
                .limit(limit)
                .populate('author')
                .populate('genres');
        } catch (error) {
            throw new ApiError(500, 'Error retrieving most played songs');
        }
    }

    async findRecommendations(songId: string, limit: number) {
        try {
            const song = await Song.findById(songId);
            if (!song) {
                throw new ApiError(404, 'Song not found');
            }

            // Obtener recomendaciones basadas en géneros y artistas similares
            return await Song.find({
                _id: { $ne: songId },
                $or: [
                    { genres: { $in: song.genres } },
                    { author: song.author },
                    { 'collaborators.artist': { $in: song.collaborators.map(c => c.artist) } }
                ]
            })
                .limit(limit)
                .populate('author')
                .populate('genres');
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, 'Error finding song recommendations');
        }
    }

    async incrementPlays(id: string) {
        try {
            return await Song.findByIdAndUpdate(
                id,
                { $inc: { plays: 1 } },
                { new: true }
            );
        } catch (error) {
            throw new ApiError(500, 'Error incrementing plays count');
        }
    }

    async findByGenrePaginated(genreId: string, skip: number, limit: number) {
        try {
            return await Song.find({ genres: new Types.ObjectId(genreId) })
                .skip(skip)
                .limit(limit)
                .populate('author')
                .populate('genres');
        } catch (error) {
            throw new ApiError(500, 'Error retrieving songs by genre');
        }
    }

    async countByGenre(genreId: string): Promise<number> {
        try {
            return await Song.countDocuments({ genres: new Types.ObjectId(genreId) });
        } catch (error) {
            throw new ApiError(500, 'Error counting songs by genre');
        }
    }

    async findAll() {
        try {
            return await Song.find()
                .populate('author')
                .populate({
                    path: 'collaborators',
                    populate: {
                        path: 'artist',
                        model: 'artist'
                    }
                })
                .populate('genres');
        } catch (error) {
            throw new ApiError(500, 'Error retrieving songs');
        }
    }

    async findByPerformer(performerId: string) {
        try {
            return await Song.find({ author: new Types.ObjectId(performerId) })
                .populate('genres');
        } catch (error) {
            throw new ApiError(500, 'Error retrieving songs by performer');
        }
    }

    async findByCollaborator(collaboratorId: string) {
        try {
            return await Song.find({ 'collaborators.artist': new Types.ObjectId(collaboratorId) })
                .populate('author')
                .populate('genres');
        } catch (error) {
            throw new ApiError(500, 'Error retrieving songs by collaborator');
        }
    }

    async create(songData: any) {
        try {
            const song = new Song(songData);
            return await song.save();
        } catch (error) {
            throw new ApiError(500, 'Error creating song');
        }
    }

    async update(id: string, songData: any) {
        try {
            return await Song.findByIdAndUpdate(
                id,
                { $set: songData },
                { new: true }
            );
        } catch (error) {
            throw new ApiError(500, 'Error updating song');
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await Song.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            throw new ApiError(500, 'Error deleting song');
        }
    }
}