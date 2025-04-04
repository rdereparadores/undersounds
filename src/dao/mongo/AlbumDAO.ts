/*import { IAlbumDAO } from "../interfaces/IAlbumDAO";
import { IAlbum } from "../../models/interfaces/IAlbum";
import AlbumModel from "../../models/AlbumModel";
import { ApiError } from "../../utils/ApiError";
import mongoose from "mongoose";

export class AlbumDAO implements IAlbumDAO {
    async findAll(): Promise<IAlbum[]> {
        return await AlbumModel.find()
            .populate('track_list')
            .populate('genres');
    }

    async findById(id: string): Promise<IAlbum | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid album ID format');
        }

        return await AlbumModel.findById(id)
            .populate('track_list')
            .populate('genres');
    }

    async findByTitle(title: string): Promise<IAlbum[]> {
        return await AlbumModel.find({
            title: { $regex: title, $options: 'i' }
        })
            .populate('track_list')
            .populate('genres');
    }

    async findByGenre(genreId: string): Promise<IAlbum[]> {
        if (!mongoose.Types.ObjectId.isValid(genreId)) {
            throw ApiError.badRequest('Invalid genre ID format');
        }

        return await AlbumModel.find({
            genres: genreId
        })
            .populate('track_list')
            .populate('genres');
    }

    async findByDateRange(startDate: Date, endDate: Date): Promise<IAlbum[]> {
        return await AlbumModel.find({
            release_date: {
                $gte: startDate,
                $lte: endDate
            }
        })
            .sort({ release_date: -1 })
            .populate('track_list')
            .populate('genres');
    }

    async create(albumData: Partial<IAlbum>): Promise<IAlbum> {
        const newAlbum = new AlbumModel(albumData);
        return await newAlbum.save();
    }

    async update(id: string, albumData: Partial<IAlbum>): Promise<IAlbum | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid album ID format');
        }

        return await AlbumModel.findByIdAndUpdate(
            id,
            { $set: albumData },
            { new: true, runValidators: true }
        )
            .populate('track_list')
            .populate('genres');
    }

    async delete(id: string): Promise<boolean> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid album ID format');
        }

        const result = await AlbumModel.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }

    async addSongToAlbum(albumId: string, songId: string): Promise<IAlbum | null> {
        if (!mongoose.Types.ObjectId.isValid(albumId) || !mongoose.Types.ObjectId.isValid(songId)) {
            throw ApiError.badRequest('Invalid ID format');
        }

        return await AlbumModel.findByIdAndUpdate(
            albumId,
            { $addToSet: { track_list: songId } },
            { new: true, runValidators: true }
        )
            .populate('track_list')
            .populate('genres');
    }

    async removeSongFromAlbum(albumId: string, songId: string): Promise<IAlbum | null> {
        if (!mongoose.Types.ObjectId.isValid(albumId) || !mongoose.Types.ObjectId.isValid(songId)) {
            throw ApiError.badRequest('Invalid ID format');
        }

        return await AlbumModel.findByIdAndUpdate(
            albumId,
            { $pull: { track_list: songId } },
            { new: true }
        )
            .populate('track_list')
            .populate('genres');
    }

    async addGenreToAlbum(albumId: string, genreId: string): Promise<IAlbum | null> {
        if (!mongoose.Types.ObjectId.isValid(albumId) || !mongoose.Types.ObjectId.isValid(genreId)) {
            throw ApiError.badRequest('Invalid ID format');
        }

        return await AlbumModel.findByIdAndUpdate(
            albumId,
            { $addToSet: { genres: genreId } },
            { new: true, runValidators: true }
        )
            .populate('track_list')
            .populate('genres');
    }

    async removeGenreFromAlbum(albumId: string, genreId: string): Promise<IAlbum | null> {
        if (!mongoose.Types.ObjectId.isValid(albumId) || !mongoose.Types.ObjectId.isValid(genreId)) {
            throw ApiError.badRequest('Invalid ID format');
        }

        return await AlbumModel.findByIdAndUpdate(
            albumId,
            { $pull: { genres: genreId } },
            { new: true }
        )
            .populate('track_list')
            .populate('genres');
    }
}

 */

// DESCOMENTAR CUANDO LA CARPETA MODELO ESTE IMPORTADA