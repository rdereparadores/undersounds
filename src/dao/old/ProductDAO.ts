import { Product } from '../models/Product';
import { Song } from '../models/Song';
import { ApiError } from '../utils/ApiError';

export class ProductDAO {
    async findById(id: string) {
        try {
            return await Product.findById(id);
        } catch (error) {
            throw new ApiError(500, 'Error retrieving product');
        }
    }

    async findByFilterWithPagination(filter: any, sort: any, skip: number, limit: number) {
        try {
            return await Product.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit);
        } catch (error) {
            throw new ApiError(500, 'Error retrieving products');
        }
    }

    async countByFilter(filter: any): Promise<number> {
        try {
            return await Product.countDocuments(filter);
        } catch (error) {
            throw new ApiError(500, 'Error counting products');
        }
    }

    async findByGenrePaginated(genreId: string, skip: number, limit: number) {
        try {
            // Primero, encontramos todas las canciones con ese género
            const songs = await Song.find({ genres: genreId }).select('_id');
            const songIds = songs.map(song => song._id);

            // Luego buscamos productos que sean canciones de ese género o álbumes que contengan esas canciones
            return await Product.find({
                $or: [
                    { _id: { $in: songIds } },
                    { track_list: { $in: songIds } }
                ]
            })
                .skip(skip)
                .limit(limit);
        } catch (error) {
            throw new ApiError(500, 'Error retrieving products by genre');
        }
    }

    async countByGenre(genreId: string): Promise<number> {
        try {
            // Similar a findByGenrePaginated pero contando
            const songs = await Song.find({ genres: genreId }).select('_id');
            const songIds = songs.map(song => song._id);

            return await Product.countDocuments({
                $or: [
                    { _id: { $in: songIds } },
                    { track_list: { $in: songIds } }
                ]
            });
        } catch (error) {
            throw new ApiError(500, 'Error counting products by genre');
        }
    }

    async update(id: string, productData: any) {
        try {
            return await Product.findByIdAndUpdate(
                id,
                { $set: productData },
                { new: true }
            );
        } catch (error) {
            throw new ApiError(500, 'Error updating product');
        }
    }

    async findAll() {
        try {
            return await Product.find();
        } catch (error) {
            throw new ApiError(500, 'Error retrieving products');
        }
    }

    async findByTitle(title: string) {
        try {
            return await Product.find({ title: { $regex: title, $options: 'i' } });
        } catch (error) {
            throw new ApiError(500, 'Error retrieving products by title');
        }
    }

    async findByReleaseDate(startDate: Date, endDate: Date) {
        try {
            return await Product.find({
                release_date: { $gte: startDate, $lte: endDate }
            });
        } catch (error) {
            throw new ApiError(500, 'Error retrieving products by release date');
        }
    }

    async create(productData: any) {
        try {
            const product = new Product(productData);
            return await product.save();
        } catch (error) {
            throw new ApiError(500, 'Error creating product');
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await Product.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            throw new ApiError(500, 'Error deleting product');
        }
    }

    async findLatestReleases(limit: number) {
        try {
            return await Product.find()
                .sort({ release_date: -1 })
                .limit(limit);
        } catch (error) {
            throw new ApiError(500, 'Error retrieving latest releases');
        }
    }
}