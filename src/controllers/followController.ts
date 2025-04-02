import { Request, Response } from 'express';
import Follow from '../models/Follow';
import UserAuth from '../models/UserAuth';
import Product from '../models/Product';
import ProductArtist from '../models/ProductArtist';

// Follow an artist
export const followArtist = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const { artistId } = req.body;

        // Check if artist exists
        const artist = await UserAuth.findOne({
            _id: artistId,
            role: 'artist'
        });

        if (!artist) {
            res.status(404).json({
                success: false,
                message: 'Artist not found'
            });
            return;
        }

        // Check if already following
        const existingFollow = await Follow.findOne({
            user_id: userId,
            artist_id: artistId
        });

        if (existingFollow) {
            res.status(400).json({
                success: false,
                message: 'Already following this artist'
            });
            return;
        }

        // Create follow relation
        const follow = new Follow({
            user_id: userId,
            artist_id: artistId
        });

        await follow.save();

        res.status(201).json({
            success: true,
            message: 'Artist followed successfully',
            data: {
                user_id: userId,
                artist_id: artistId,
                is_following: true
            }
        });
    } catch (error: any) {
        console.error('Error following artist:', error);
        res.status(500).json({
            success: false,
            message: 'Error following artist',
            error: error.message
        });
    }
};

// Unfollow an artist
export const unfollowArtist = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const artistId = req.params.artistId;

        // Check if following
        const existingFollow = await Follow.findOne({
            user_id: userId,
            artist_id: artistId
        });

        if (!existingFollow) {
            res.status(400).json({
                success: false,
                message: 'Not following this artist'
            });
            return;
        }

        // Delete the follow relation
        await Follow.findByIdAndDelete(existingFollow._id);

        res.status(200).json({
            success: true,
            message: 'Artist unfollowed successfully',
            data: {
                user_id: userId,
                artist_id: artistId,
                is_following: false
            }
        });
    } catch (error: any) {
        console.error('Error unfollowing artist:', error);
        res.status(500).json({
            success: false,
            message: 'Error unfollowing artist',
            error: error.message
        });
    }
};

// Toggle follow status
export const toggleFollowArtist = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const artistId = req.params.artistId;

        // Check if artist exists
        const artist = await UserAuth.findOne({
            _id: artistId,
            role: 'artist'
        });

        if (!artist) {
            res.status(404).json({
                success: false,
                message: 'Artist not found'
            });
            return;
        }

        // Check if already following
        const existingFollow = await Follow.findOne({
            user_id: userId,
            artist_id: artistId
        });

        if (existingFollow) {
            // If already following, unfollow
            await Follow.findByIdAndDelete(existingFollow._id);

            res.status(200).json({
                success: true,
                message: 'Artist unfollowed successfully',
                data: {
                    user_id: userId,
                    artist_id: artistId,
                    is_following: false
                }
            });
        } else {
            // If not following, follow
            const follow = new Follow({
                user_id: userId,
                artist_id: artistId
            });

            await follow.save();

            res.status(201).json({
                success: true,
                message: 'Artist followed successfully',
                data: {
                    user_id: userId,
                    artist_id: artistId,
                    is_following: true
                }
            });
        }
    } catch (error: any) {
        console.error('Error toggling follow status:', error);
        res.status(500).json({
            success: false,
            message: 'Error toggling follow status',
            error: error.message
        });
    }
};

// Get followed artists
export const getFollowedArtists = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;

        const follows = await Follow.find({ user_id: userId })
            .populate({
                path: 'artist_id',
                select: 'artist_name img_url'
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: follows.length,
            data: follows.map(follow => ({
                id: follow.artist_id,
                name: (follow.artist_id as any).artist_name,
                img_url: (follow.artist_id as any).img_url,
                followed_at: follow.createdAt
            }))
        });
    } catch (error: any) {
        console.error('Error getting followed artists:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting followed artists',
            error: error.message
        });
    }
};

// Get artist followers
export const getArtistFollowers = async (req: Request, res: Response): Promise<void> => {
    try {
        const artistId = req.params.artistId;

        const follows = await Follow.find({ artist_id: artistId })
            .populate({
                path: 'user_id',
                select: 'username name img_url'
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: follows.length,
            data: follows.map(follow => ({
                id: (follow.user_id as any)._id,
                username: (follow.user_id as any).username,
                name: (follow.user_id as any).name,
                img_url: (follow.user_id as any).img_url,
                followed_at: follow.createdAt
            }))
        });
    } catch (error: any) {
        console.error('Error getting artist followers:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting artist followers',
            error: error.message
        });
    }
};

// Get artist recommendations (artists not followed yet)
export const getArtistRecommendations = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const limit = Number(req.query.limit) || 3;

        // Get IDs of artists already followed
        const follows = await Follow.find({ user_id: userId });
        const followedArtistIds = follows.map(follow => follow.artist_id);

        // Find artists with most followers that user is not following
        const recommendations = await UserAuth.aggregate([
            {
                $match: {
                    role: 'artist',
                    _id: { $nin: followedArtistIds }
                }
            },
            {
                $lookup: {
                    from: 'follows',
                    localField: '_id',
                    foreignField: 'artist_id',
                    as: 'followers'
                }
            },
            {
                $project: {
                    _id: 1,
                    artist_name: 1,
                    img_url: 1,
                    follower_count: { $size: '$followers' },
                    is_following: { $literal: false }
                }
            },
            { $sort: { follower_count: -1 } },
            { $limit: limit }
        ]);

        res.status(200).json({
            success: true,
            count: recommendations.length,
            data: recommendations
        });
    } catch (error: any) {
        console.error('Error getting artist recommendations:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting artist recommendations',
            error: error.message
        });
    }
};

// Get artist releases for followed artists
export const getFollowedArtistReleases = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const limit = Number(req.query.limit) || 5;

        // Get IDs of artists followed by the user
        const follows = await Follow.find({ user_id: userId });
        const followedArtistIds = follows.map(follow => follow.artist_id);

        if (followedArtistIds.length === 0) {
            res.status(200).json({
                success: true,
                count: 0,
                data: []
            });
            return;
        }

        // Find recent releases from those artists
        const artistReleases = await ProductArtist.aggregate([
            {
                $match: {
                    artist_id: { $in: followedArtistIds }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $lookup: {
                    from: 'userauths',
                    localField: 'artist_id',
                    foreignField: '_id',
                    as: 'artist'
                }
            },
            { $unwind: '$artist' },
            {
                $project: {
                    _id: '$product._id',
                    title: '$product.title',
                    type: '$product.type',
                    img_url: '$product.img_url',
                    release_date: '$product.release_date',
                    artist: {
                        id: '$artist._id',
                        name: '$artist.artist_name'
                    }
                }
            },
            { $sort: { release_date: -1 } },
            { $limit: limit }
        ]);

        res.status(200).json({
            success: true,
            count: artistReleases.length,
            data: artistReleases
        });
    } catch (error: any) {
        console.error('Error getting followed artist releases:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting followed artist releases',
            error: error.message
        });
    }
};