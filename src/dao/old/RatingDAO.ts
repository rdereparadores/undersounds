import { Rating } from '../models/Rating';
import { ApiError } from '../utils/ApiError';
import { Types } from 'mongoose';

export class RatingDAO {
    async findById(id: string) {
        try {
            return await Rating.findById(id)
                .populate('author')
                .populate('product');
        } catch (error) {
            throw new ApiError(500, 'Error retrieving rating');
        }
    }

    async findByProduct(productId: string) {
        try {
            return await Rating.find({ product: new Types.ObjectId(productId) })
                .populate('author')
                .sort({ publish_date: -1 });
        } catch (error) {
            throw new ApiError(500, 'Error retrieving ratings by product');
        }
    }

    async findByProductAndAuthor(productId: string, authorId: string) {
        try {
            return await Rating.findOne({
                product: new Types.ObjectId(productId),
                author: new Types.ObjectId(authorId)
            });
        } catch (error) {
            throw new ApiError(500, 'Error checking if user has already rated this product');
        }
    }

    async create(ratingData: any) {
        try {
            const rating = new Rating(ratingData);
            return await rating.save();
        } catch (error: any) {
            if (error.code === 11000) { // Duplicate key error
                throw new ApiError(409, 'User has already rated this product');
            }
            throw new ApiError(500, 'Error creating rating');
        }
    }

    async update(id: string, ratingData: any) {
        try {
            return await Rating.findByIdAndUpdate(
                id,
                { $set: ratingData },
                { new: true }
            )
                .populate('author')
                .populate('product');
        } catch (error) {
            throw new ApiError(500, 'Error updating rating');
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await Rating.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            throw new ApiError(500, 'Error deleting rating');
        }
    }

    async getAverageRatingForProduct(productId: string): Promise<number> {
        try {
            const result = await Rating.aggregate([
                { $match: { product: new Types.ObjectId(productId) } },
                { $group: { _id: null, average: { $avg: '$rating' } } }
            ]);

            return result.length > 0 ? result[0].average : 0;
        } catch (error) {
            throw new ApiError(500, 'Error calculating average rating for product');
        }
    }

    async findAll() {
        try {
            return await Rating.find()
                .populate('author')
                .populate('product')
                .sort({ publish_date: -1 });
        } catch (error) {
            throw new ApiError(500, 'Error retrieving ratings');
        }
    }

    async findByAuthor(authorId: string) {
        try {
            return await Rating.find({ author: new Types.ObjectId(authorId) })
                .populate('product')
                .sort({ publish_date: -1 });
        } catch (error) {
            throw new ApiError(500, 'Error retrieving ratings by author');
        }
    }
}