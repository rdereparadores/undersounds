import { Request, Response } from 'express';
import mongoose from 'mongoose';
import PlayHistory from '../models/PlayHistory';
import Product from '../models/Product';
import ProductArtist from '../models/ProductArtist';
import Genre from '../models/Genre';
import ProductGenre from '../models/ProductGenre';

// Record a play event
export const recordPlay = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const { songId } = req.body;

        // Check if song exists and is of type 'song'
        const song = await Product.findOne({ _id: songId, type: 'song' });
        if (!song) {
            res.status(404).json({
                success: false,
                message: 'Song not found'
            });
            return;
        }

        // Record the play event
        const playEvent = new PlayHistory({
            user_id: userId,
            song_id: songId,
            played_at: new Date()
        });

        await playEvent.save();

        // Increment song popularity
        await Product.findByIdAndUpdate(
            songId,
            { $inc: { popularity: 1 } }
        );

        res.status(201).json({
            success: true,
            message: 'Play recorded successfully',
            data: playEvent
        });
    } catch (error: any) {
        console.error('Error recording play:', error);
        res.status(500).json({
            success: false,
            message: 'Error recording play',
            error: error.message
        });
    }
};

// Get recent plays for a user
export const getUserRecentPlays = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const limit = Number(req.query.limit) || 10;

        const recentPlays = await PlayHistory.find({ user_id: userId })
            .populate({
                path: 'song_id',
                select: 'title img_url'
            })
            .sort({ played_at: -1 })
            .limit(limit);

        // Get artist for each song
        const playsWithArtists = await Promise.all(recentPlays.map(async (play) => {
            const songId = (play.song_id as any)._id;

            // Get artists of the song
            const artistRelations = await ProductArtist.find({ product_id: songId })
                .populate('artist_id', 'artist_name');

            const artists = artistRelations.map(rel => ({
                id: (rel.artist_id as any)._id,
                name: (rel.artist_id as any).artist_name
            }));

            return {
                ...play.toObject(),
                artists
            };
        }));

        res.status(200).json({
            success: true,
            count: playsWithArtists.length,
            data: playsWithArtists
        });
    } catch (error: any) {
        console.error('Error getting user recent plays:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting user recent plays',
            error: error.message
        });
    }
};

// Get user's listening statistics
export const getUserListeningStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const days = Number(req.query.days) || 30;

        // Date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Get total listening time
        const plays = await PlayHistory.find({
            user_id: userId,
            played_at: { $gte: startDate, $lte: endDate }
        }).populate('song_id', 'duration');

        const totalListenTime = plays.reduce((sum, play) => {
            return sum + ((play.song_id as any)?.duration || 0);
        }, 0);

        // Get preferred genre
        const genrePlays = await PlayHistory.aggregate([
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(userId),
                    played_at: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $lookup: {
                    from: 'productgenres',
                    localField: 'song_id',
                    foreignField: 'product_id',
                    as: 'productGenres'
                }
            },
            { $unwind: '$productGenres' },
            {
                $lookup: {
                    from: 'genres',
                    localField: 'productGenres.genre_id',
                    foreignField: '_id',
                    as: 'genre'
                }
            },
            { $unwind: '$genre' },
            {
                $group: {
                    _id: '$genre._id',
                    name: { $first: '$genre.genre' },
                    playCount: { $sum: 1 }
                }
            },
            { $sort: { playCount: -1 } },
            { $limit: 1 }
        ]);

        const preferredGenre = genrePlays.length > 0 ? genrePlays[0] : null;

        // Get most played artist
        const artistPlays = await PlayHistory.aggregate([
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(userId),
                    played_at: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $lookup: {
                    from: 'productartists',
                    localField: 'song_id',
                    foreignField: 'product_id',
                    as: 'productArtists'
                }
            },
            { $unwind: '$productArtists' },
            {
                $lookup: {
                    from: 'artists',
                    localField: 'productArtists.artist_id',
                    foreignField: '_id',
                    as: 'artist'
                }
            },
            { $unwind: '$artist' },
            {
                $group: {
                    _id: '$artist._id',
                    name: { $first: '$artist.artist_name' },
                    playCount: { $sum: 1 }
                }
            },
            { $sort: { playCount: -1 } },
            { $limit: 1 }
        ]);

        const mostPlayedArtist = artistPlays.length > 0 ? artistPlays[0] : null;

        // Calculate percentage for most played artist
        let artistPercentage = 0;
        if (mostPlayedArtist && plays.length > 0) {
            artistPercentage = (mostPlayedArtist.playCount / plays.length) * 100;
        }

        res.status(200).json({
            success: true,
            data: {
                totalPlays: plays.length,
                totalListenTime,
                preferredGenre,
                mostPlayedArtist: mostPlayedArtist ? {
                    ...mostPlayedArtist,
                    percentage: Math.round(artistPercentage)
                } : null
            }
        });
    } catch (error: any) {
        console.error('Error getting user listening stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting user listening stats',
            error: error.message
        });
    }
};

// Get top artists for a user
export const getUserTopArtists = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const days = Number(req.query.days) || 30;
        const limit = Number(req.query.limit) || 5;

        // Date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const topArtists = await PlayHistory.aggregate([
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(userId),
                    played_at: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $lookup: {
                    from: 'productartists',
                    localField: 'song_id',
                    foreignField: 'product_id',
                    as: 'productArtists'
                }
            },
            { $unwind: '$productArtists' },
            {
                $lookup: {
                    from: 'artists',
                    localField: 'productArtists.artist_id',
                    foreignField: '_id',
                    as: 'artist'
                }
            },
            { $unwind: '$artist' },
            {
                $group: {
                    _id: '$artist._id',
                    name: { $first: '$artist.artist_name' },
                    playCount: { $sum: 1 }
                }
            },
            { $sort: { playCount: -1 } },
            { $limit: limit }
        ]);

        res.status(200).json({
            success: true,
            count: topArtists.length,
            data: topArtists
        });
    } catch (error: any) {
        console.error('Error getting user top artists:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting user top artists',
            error: error.message
        });
    }
};

// Get user's playtime by day
export const getUserPlaytimeByDay = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const days = Number(req.query.days) || 7;

        // Date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const playsByDay = await PlayHistory.aggregate([
            {
                $match: {
                    user_id: new mongoose.Types.ObjectId(userId),
                    played_at: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'song_id',
                    foreignField: '_id',
                    as: 'song'
                }
            },
            { $unwind: '$song' },
            {
                $group: {
                    _id: {
                        year: { $year: '$played_at' },
                        month: { $month: '$played_at' },
                        day: { $dayOfMonth: '$played_at' }
                    },
                    totalDuration: { $sum: '$song.duration' },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $dateFromParts: {
                            year: '$_id.year',
                            month: '$_id.month',
                            day: '$_id.day'
                        }
                    },
                    totalDuration: 1,
                    count: 1
                }
            },
            { $sort: { date: 1 } }
        ]);

        res.status(200).json({
            success: true,
            count: playsByDay.length,
            data: playsByDay
        });
    } catch (error: any) {
        console.error('Error getting user playtime by day:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting user playtime by day',
            error: error.message
        });
    }
};