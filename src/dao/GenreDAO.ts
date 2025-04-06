import { Genre } from '../models/Genre';
import { ApiError } from '../utils/ApiError';

export class GenreDAO {
    async findAll() {
        try {
            return await Genre.find().sort({ genre: 1 });
        } catch (error) {
            throw new ApiError(500, 'Error retrieving genres');
        }
    }

    async findById(id: string) {
        try {
            return await Genre.findById(id);
        } catch (error) {
            throw new ApiError(500, 'Error retrieving genre');
        }
    }

    async findByName(genre: string) {
        try {
            return await Genre.findOne({ genre: { $regex: new RegExp(`^${genre}$`, 'i') } });
        } catch (error) {
            throw new ApiError(500, 'Error retrieving genre by name');
        }
    }

    async create(genreData: { genre: string }) {
        try {
            const genre = new Genre(genreData);
            return await genre.save();
        } catch (error: any) {
            if (error.code === 11000) { // Duplicate key error
                throw new ApiError(409, 'Genre already exists');
            }
            throw new ApiError(500, 'Error creating genre');
        }
    }

    async update(id: string, genreData: { genre: string }) {
        try {
            return await Genre.findByIdAndUpdate(
                id,
                { $set: genreData },
                { new: true }
            );
        } catch (error: any) {
            if (error.code === 11000) { // Duplicate key error
                throw new ApiError(409, 'Genre name already exists');
            }
            throw new ApiError(500, 'Error updating genre');
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await Genre.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            throw new ApiError(500, 'Error deleting genre');
        }
    }
}