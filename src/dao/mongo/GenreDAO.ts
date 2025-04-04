/*import { IGenreDAO } from "../interfaces/IgenreDAO";
import { IGenre } from "../../models/interfaces/IGenre";
import GenreModel from "../../models/GenreModel";
import { ApiError } from "../../utils/ApiError";
import mongoose from "mongoose";

export class GenreDAO implements IGenreDAO {
    async findAll(): Promise<IGenre[]> {
        return await GenreModel.find().sort({ genre: 1 });
    }

    async findById(id: string): Promise<IGenre | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid genre ID format');
        }

        return await GenreModel.findById(id);
    }

    async findByName(name: string): Promise<IGenre | null> {
        return await GenreModel.findOne({
            genre: { $regex: `^${name}$`, $options: 'i' }
        });
    }

    async create(genreData: Partial<IGenre>): Promise<IGenre> {
        // Verificar si el género ya existe
        const existingGenre = await this.findByName(genreData.genre as string);

        if (existingGenre) {
            throw ApiError.conflict('Genre already exists');
        }

        const newGenre = new GenreModel(genreData);
        return await newGenre.save();
    }

    async update(id: string, genreData: Partial<IGenre>): Promise<IGenre | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid genre ID format');
        }

        // Verificar si el nuevo nombre de género ya existe
        if (genreData.genre) {
            const existingGenre = await GenreModel.findOne({
                _id: { $ne: id },
                genre: { $regex: `^${genreData.genre}$`, $options: 'i' }
            });

            if (existingGenre) {
                throw ApiError.conflict('Genre name already exists');
            }
        }

        return await GenreModel.findByIdAndUpdate(
            id,
            { $set: genreData },
            { new: true, runValidators: true }
        );
    }

    async delete(id: string): Promise<boolean> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid genre ID format');
        }

        const result = await GenreModel.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }
}

 */

// DESCOMENTAR CUANDO LA CARPETA MODELO ESTE IMPORTADA