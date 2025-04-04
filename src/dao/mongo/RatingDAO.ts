/*import { IRatingDAO } from "../interfaces/IRatingDAO";
import { IRating } from "../../models/interfaces/IRating";
import RatingModel from "../../models/RatingModel";
import { ApiError } from "../../utils/ApiError";
import mongoose from "mongoose";

export class RatingDAO implements IRatingDAO {
    async findAll(): Promise<IRating[]> {
        return await RatingModel.find()
            .sort({ publish_date: -1 })
            .populate('author')
            .populate('product');
    }

    async findById(id: string): Promise<IRating | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid rating ID format');
        }

        return await RatingModel.findById(id)
            .populate('author')
            .populate('product');
    }

    async findByProduct(productId: string): Promise<IRating[]> {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw ApiError.badRequest('Invalid product ID format');
        }

        return await RatingModel.find({ product: productId })
            .sort({ publish_date: -1 })
            .populate('author')
            .populate('product');
    }

    async findByAuthor(authorId: string): Promise<IRating[]> {
        if (!mongoose.Types.ObjectId.isValid(authorId)) {
            throw ApiError.badRequest('Invalid author ID format');
        }

        return await RatingModel.find({ author: authorId })
            .sort({ publish_date: -1 })
            .populate('author')
            .populate('product');
    }

    async findByProductAndAuthor(productId: string, authorId: string): Promise<IRating | null> {
        if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(authorId)) {
            throw ApiError.badRequest('Invalid ID format');
        }

        return await RatingModel.findOne({
            product: productId,
            author: authorId
        })
            .populate('author')
            .populate('product');
    }

    async getAverageRatingForProduct(productId: string): Promise<number> {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw ApiError.badRequest('Invalid product ID format');
        }

        const result = await RatingModel.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(productId) } },
            { $group: { _id: "$product", averageRating: { $avg: "$rating" } } }
        ]);

        return result.length > 0 ? parseFloat(result[0].averageRating.toFixed(1)) : 0;
    }

    async create(ratingData: Partial<IRating>): Promise<IRating> {
        // Verificar si el usuario ya ha calificado este producto
        if (ratingData.author && ratingData.product) {
            const existingRating = await this.findByProductAndAuthor(
                ratingData.product.toString(),
                ratingData.author.toString()
            );

            if (existingRating) {
                throw ApiError.conflict('User has already rated this product');
            }
        }

        const newRating = new RatingModel(ratingData);
        return await newRating.save();
    }

    async update(id: string, ratingData: Partial<IRating>): Promise<IRating | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid rating ID format');
        }

        return await RatingModel.findByIdAndUpdate(
            id,
            { $set: ratingData },
            { new: true, runValidators: true }
        )
            .populate('author')
            .populate('product');
    }

    async delete(id: string): Promise<boolean> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid rating ID format');
        }

        const result = await RatingModel.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }
}

 */

// DESCOMENTAR CUANDO LA CARPETA MODELO ESTE IMPORTADA