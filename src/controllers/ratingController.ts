import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Rating from '../models/Rating';
import Product from '../models/Product';
import UserAuth from '../models/UserAuth';

// Add a product rating
export const addRating = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const { productId, rating, title, description } = req.body;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found'
            });
            return;
        }

        // Validate rating score
        if (rating < 1 || rating > 5) {
            res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
            return;
        }

        // Check if user has already rated this product
        const existingRating = await Rating.findOne({
            user_id: userId,
            product_id: productId
        });

        if (existingRating) {
            res.status(400).json({
                success: false,
                message: 'You have already rated this product'
            });
            return;
        }

        // Create the rating
        const newRating = new Rating({
            user_id: userId,
            product_id: productId,
            rating,
            title,
            description
        });

        const savedRating = await newRating.save();

        // Populate user info for response
        const populatedRating = await Rating.findById(savedRating._id)
            .populate('user_id', 'username img_url');

        if (!populatedRating) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving saved rating'
            });
            return;
        }

        res.status(201).json({
            success: true,
            message: 'Rating added successfully',
            data: {
                _id: populatedRating._id,
                rating: populatedRating.rating,
                title: populatedRating.title,
                description: populatedRating.description,
                createdAt: populatedRating.createdAt,
                user: {
                    id: (populatedRating.user_id as any)?._id,
                    username: (populatedRating.user_id as any)?.username,
                    img_url: (populatedRating.user_id as any)?.img_url
                }
            }
        });
    } catch (error: any) {
        console.error('Error adding rating:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding rating',
            error: error.message
        });
    }
};

// Update a rating
export const updateRating = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const ratingId = req.params.ratingId;
        const { rating, title, description } = req.body;

        // Validate rating score
        if (rating !== undefined && (rating < 1 || rating > 5)) {
            res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
            return;
        }

        // Check if rating exists and belongs to user
        const existingRating = await Rating.findOne({
            _id: ratingId,
            user_id: userId
        });

        if (!existingRating) {
            res.status(404).json({
                success: false,
                message: 'Rating not found or does not belong to user'
            });
            return;
        }

        // Update the rating
        const updatedRating = await Rating.findByIdAndUpdate(
            ratingId,
            {
                rating: rating !== undefined ? rating : existingRating.rating,
                title: title !== undefined ? title : existingRating.title,
                description: description !== undefined ? description : existingRating.description
            },
            { new: true }
        ).populate('user_id', 'username img_url');

        if (!updatedRating) {
            res.status(404).json({
                success: false,
                message: 'Rating not found after update'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Rating updated successfully',
            data: {
                _id: updatedRating._id,
                rating: updatedRating.rating,
                title: updatedRating.title,
                description: updatedRating.description,
                createdAt: updatedRating.createdAt,
                updatedAt: updatedRating.updatedAt,
                user: {
                    id: (updatedRating.user_id as any)?._id,
                    username: (updatedRating.user_id as any)?.username,
                    img_url: (updatedRating.user_id as any)?.img_url
                }
            }
        });
    } catch (error: any) {
        console.error('Error updating rating:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating rating',
            error: error.message
        });
    }
};

// Delete a rating
export const deleteRating = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const ratingId = req.params.ratingId;

        // Check if rating exists and belongs to user
        const existingRating = await Rating.findOne({
            _id: ratingId,
            user_id: userId
        });

        if (!existingRating) {
            res.status(404).json({
                success: false,
                message: 'Rating not found or does not belong to user'
            });
            return;
        }

        // Delete the rating
        await Rating.findByIdAndDelete(ratingId);

        res.status(200).json({
            success: true,
            message: 'Rating deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting rating:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting rating',
            error: error.message
        });
    }
};

// Get product ratings
export const getProductRatings = async (req: Request, res: Response): Promise<void> => {
    try {
        const productId = req.params.productId;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found'
            });
            return;
        }

        // Get ratings
        const ratings = await Rating.find({ product_id: productId })
            .populate('user_id', 'username img_url')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count
        const total = await Rating.countDocuments({ product_id: productId });

        // Format response
        const formattedRatings = ratings.map(rating => ({
            _id: rating._id,
            rating: rating.rating,
            title: rating.title,
            description: rating.description,
            createdAt: rating.createdAt,
            user: {
                id: (rating.user_id as any)._id,
                username: (rating.user_id as any).username,
                img_url: (rating.user_id as any).img_url
            }
        }));

        res.status(200).json({
            success: true,
            count: formattedRatings.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: formattedRatings
        });
    } catch (error: any) {
        console.error('Error getting product ratings:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting product ratings',
            error: error.message
        });
    }
};

// Get rating statistics for a product
export const getProductRatingStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const productId = req.params.productId;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found'
            });
            return;
        }

        // Get average rating
        const averageResult = await Rating.aggregate([
            { $match: { product_id: new mongoose.Types.ObjectId(productId) } },
            { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }
        ]);

        const average = averageResult.length > 0 ? averageResult[0].average : 0;
        const count = averageResult.length > 0 ? averageResult[0].count : 0;

        // Get distribution by rating value
        const distributionResult = await Rating.aggregate([
            { $match: { product_id: new mongoose.Types.ObjectId(productId) } },
            { $group: { _id: '$rating', count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
        ]);

        // Format distribution
        const distribution = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        };

        distributionResult.forEach(item => {
            distribution[item._id as keyof typeof distribution] = item.count;
        });

        res.status(200).json({
            success: true,
            data: {
                average,
                count,
                distribution
            }
        });
    } catch (error: any) {
        console.error('Error getting product rating stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting product rating stats',
            error: error.message
        });
    }
};

// Get user's ratings
export const getUserRatings = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get ratings
        const ratings = await Rating.find({ user_id: userId })
            .populate({
                path: 'product_id',
                select: 'title img_url type'
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count
        const total = await Rating.countDocuments({ user_id: userId });

        res.status(200).json({
            success: true,
            count: ratings.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: ratings
        });
    } catch (error: any) {
        console.error('Error getting user ratings:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting user ratings',
            error: error.message
        });
    }
};