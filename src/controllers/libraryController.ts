import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Library from '../models/Library';
import Product from '../models/Product';
import ProductArtist from '../models/ProductArtist';
import ProductSong from '../models/ProductSong';

// Get user's library (songs)
export const getUserLibrarySongs = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;

        // Find songs in user's library
        const librarySongs = await Library.find({
            user_id: userId
        })
            .populate({
                path: 'product_id',
                match: { type: 'song' },
                select: 'title img_url duration'
            })
            .sort({ added_at: -1 });

        // Filter out null/undefined products (which would be albums)
        const validSongs = librarySongs.filter(item => item.product_id !== null);

        // Get artist for each song
        const songsWithArtists = await Promise.all(validSongs.map(async (item) => {
            const productId = (item.product_id as any)._id;

            // Get artists of the song
            const artistRelations = await ProductArtist.find({ product_id: productId })
                .populate('artist_id', 'artist_name');

            const artists = artistRelations.map(rel => ({
                id: (rel.artist_id as any)._id,
                name: (rel.artist_id as any).artist_name
            }));

            return {
                ...item.toObject(),
                artists
            };
        }));

        res.status(200).json({
            success: true,
            count: songsWithArtists.length,
            data: songsWithArtists
        });
    } catch (error: any) {
        console.error('Error getting user library songs:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting user library songs',
            error: error.message
        });
    }
};

// Get user's library (albums)
export const getUserLibraryAlbums = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;

        // Find albums in user's library
        const libraryAlbums = await Library.find({
            user_id: userId
        })
            .populate({
                path: 'product_id',
                match: { type: 'album' },
                select: 'title img_url release_date'
            })
            .sort({ added_at: -1 });

        // Filter out null/undefined products (which would be songs)
        const validAlbums = libraryAlbums.filter(item => item.product_id !== null);

        // Get additional data for each album
        const albumsWithDetails = await Promise.all(validAlbums.map(async (item) => {
            const productId = (item.product_id as any)._id;

            // Get artists of the album
            const artistRelations = await ProductArtist.find({ product_id: productId })
                .populate('artist_id', 'artist_name');

            const artists = artistRelations.map(rel => ({
                id: (rel.artist_id as any)._id,
                name: (rel.artist_id as any).artist_name
            }));

            // Get track count
            const trackCount = await ProductSong.countDocuments({ album_id: productId });

            // Get total duration by summing up all songs in the album
            const tracks = await ProductSong.find({ album_id: productId })
                .populate('song_id', 'duration');

            const totalDuration = tracks.reduce((sum, track) => {
                return sum + ((track.song_id as any)?.duration || 0);
            }, 0);

            return {
                ...item.toObject(),
                artists,
                trackCount,
                totalDuration
            };
        }));

        res.status(200).json({
            success: true,
            count: albumsWithDetails.length,
            data: albumsWithDetails
        });
    } catch (error: any) {
        console.error('Error getting user library albums:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting user library albums',
            error: error.message
        });
    }
};

// Add product to library
export const addToLibrary = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const { productId, format = 'digital' } = req.body;

        // Verify format is valid
        if (!['digital', 'cd', 'vinyl', 'cassette'].includes(format)) {
            res.status(400).json({
                success: false,
                message: 'Invalid format. Must be one of: digital, cd, vinyl, cassette'
            });
            return;
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found'
            });
            return;
        }

        // Check if product is already in library
        const existingItem = await Library.findOne({
            user_id: userId,
            product_id: productId,
            format
        });

        if (existingItem) {
            res.status(400).json({
                success: false,
                message: 'Product already in library'
            });
            return;
        }

        // Add to library
        const libraryItem = new Library({
            user_id: userId,
            product_id: productId,
            format,
            added_at: new Date()
        });

        await libraryItem.save();

        res.status(201).json({
            success: true,
            message: 'Product added to library successfully',
            data: libraryItem
        });
    } catch (error: any) {
        console.error('Error adding to library:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding to library',
            error: error.message
        });
    }
};

// Remove from library
export const removeFromLibrary = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const libraryItemId = req.params.itemId;

        // Find and delete the library item
        const deletedItem = await Library.findOneAndDelete({
            _id: libraryItemId,
            user_id: userId
        });

        if (!deletedItem) {
            res.status(404).json({
                success: false,
                message: 'Library item not found or does not belong to user'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Product removed from library successfully'
        });
    } catch (error: any) {
        console.error('Error removing from library:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing from library',
            error: error.message
        });
    }
};

// Get recent additions to library
export const getRecentAdditions = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const limit = Number(req.query.limit) || 10;

        // Find recent additions to library
        const recentItems = await Library.find({
            user_id: userId
        })
            .populate({
                path: 'product_id',
                select: 'title img_url type release_date'
            })
            .sort({ added_at: -1 })
            .limit(limit);

        // Get artist for each item
        const itemsWithArtists = await Promise.all(recentItems.map(async (item) => {
            const productId = (item.product_id as any)._id;

            // Get artists of the product
            const artistRelations = await ProductArtist.find({ product_id: productId })
                .populate('artist_id', 'artist_name');

            const artists = artistRelations.map(rel => ({
                id: (rel.artist_id as any)._id,
                name: (rel.artist_id as any).artist_name
            }));

            return {
                ...item.toObject(),
                artists
            };
        }));

        res.status(200).json({
            success: true,
            count: itemsWithArtists.length,
            data: itemsWithArtists
        });
    } catch (error: any) {
        console.error('Error getting recent library additions:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting recent library additions',
            error: error.message
        });
    }
};