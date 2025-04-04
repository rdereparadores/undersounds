/* import { ISongDAO } from "../interfaces/ISongDAO";
import { ISong } from "../../models/interfaces/ISong";
import SongModel from "../../models/SongModel";
import { ApiError } from "../../utils/ApiError";
import mongoose from "mongoose";

export class SongDAO implements ISongDAO {
    async findAll(): Promise<ISong[]> {
        return await SongModel.find()
            .populate('performer')
            .populate('collaborators')
            .populate('genres');
    }

    async findById(id: string): Promise<ISong | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid song ID format');
        }

        return await SongModel.findById(id)
            .populate('performer')
            .populate('collaborators')
            .populate('genres');
    }

    async findByTitle(title: string): Promise<ISong[]> {
        return await SongModel.find({
            title: { $regex: title, $options: 'i' }
        })
            .populate('performer')
            .populate('collaborators')
            .populate('genres');
    }

    async findByPerformer(performerId: string): Promise<ISong[]> {
        if (!mongoose.Types.ObjectId.isValid(performerId)) {
            throw ApiError.badRequest('Invalid performer ID format');
        }

        return await SongModel.find({ performer: performerId })
            .populate('performer')
            .populate('collaborators')
            .populate('genres');
    }

    async findByCollaborator(collaboratorId: string): Promise<ISong[]> {
        if (!mongoose.Types.ObjectId.isValid(collaboratorId)) {
            throw ApiError.badRequest('Invalid collaborator ID format');
        }

        return await SongModel.find({ collaborators: collaboratorId })
            .populate('performer')
            .populate('collaborators')
            .populate('genres');
    }

    async findByGenre(genreId: string): Promise<ISong[]> {
        if (!mongoose.Types.ObjectId.isValid(genreId)) {
            throw ApiError.badRequest('Invalid genre ID format');
        }

        return await SongModel.find({ genres: genreId })
            .populate('performer')
            .populate('collaborators')
            .populate('genres');
    }

    async findMostPlayed(limit: number = 10): Promise<ISong[]> {
        return await SongModel.find()
            .sort({ plays: -1 })
            .limit(limit)
            .populate('performer')
            .populate('collaborators')
            .populate('genres');
    }

    async create(songData: Partial<ISong>): Promise<ISong> {
        const newSong = new SongModel(songData);
        return await newSong.save();
    }

    async update(id: string, songData: Partial<ISong>): Promise<ISong | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid song ID format');
        }

        return await SongModel.findByIdAndUpdate(
            id,
            { $set: songData },
            { new: true, runValidators: true }
        )
            .populate('performer')
            .populate('collaborators')
            .populate('genres');
    }

    async delete(id: string): Promise<boolean> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid song ID format');
        }

        const result = await SongModel.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }

    async incrementPlays(id: string): Promise<ISong | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid song ID format');
        }

        return await SongModel.findByIdAndUpdate(
            id,
            { $inc: { plays: 1 } },
            { new: true }
        )
            .populate('performer')
            .populate('collaborators')
            .populate('genres');
    }

    async addCollaborator(songId: string, artistId: string): Promise<ISong | null> {
        if (!mongoose.Types.ObjectId.isValid(songId) || !mongoose.Types.ObjectId.isValid(artistId)) {
            throw ApiError.badRequest('Invalid ID format');
        }

        return await SongModel.findByIdAndUpdate(
            songId,
            { $addToSet: { collaborators: artistId } },
            { new: true, runValidators: true }
        )
            .populate('performer')
            .populate('collaborators')
            .populate('genres');
    }

    async removeCollaborator(songId: string, artistId: string): Promise<ISong | null> {
        if (!mongoose.Types.ObjectId.isValid(songId) || !mongoose.Types.ObjectId.isValid(artistId)) {
            throw ApiError.badRequest('Invalid ID format');
        }

        return await SongModel.findByIdAndUpdate(
            songId,
            { $pull: { collaborators: artistId } },
            { new: true }
        )
            .populate('performer')
            .populate('collaborators')
            .populate('genres');
    }

    async addGenre(songId: string, genreId: string): Promise<ISong | null> {
        if (!mongoose.Types.ObjectId.isValid(songId) || !mongoose.Types.ObjectId.isValid(genreId)) {
            throw ApiError.badRequest('Invalid ID format');
        }

        return await SongModel.findByIdAndUpdate(
            songId,
            { $addToSet: { genres: genreId } },
            { new: true, runValidators: true }
        )
            .populate('performer')
            .populate('collaborators')
            .populate('genres');
    }

    async removeGenre(songId: string, genreId: string): Promise<ISong | null> {
        if (!mongoose.Types.ObjectId.isValid(songId) || !mongoose.Types.ObjectId.isValid(genreId)) {
            throw ApiError.badRequest('Invalid ID format');
        }

        return await SongModel.findByIdAndUpdate(
            songId,
            { $pull: { genres: genreId } },
            { new: true }
        )
            .populate('performer')
            .populate('collaborators')
            .populate('genres');
    }
}

 */

// DESCOMENTAR CUANDO LA CARPETA MODELO ESTE IMPORTADA