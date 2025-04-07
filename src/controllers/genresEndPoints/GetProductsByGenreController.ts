import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';
import { Types } from "mongoose";

/**
 * @desc    Get products by genre
 * @route   GET /api/genres/:id/products
 * @access  Public
 */
export const getProductsByGenre = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { productType } = req.query;
        const page = parseInt(req.query.page as string || '1');
        const limit = parseInt(req.query.limit as string || '10');

        if (isNaN(page) || page < 1) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Page must be a positive number',
                    code: 'INVALID_PAGE_PARAMETER'
                }
            });
        }

        if (isNaN(limit) || limit < 1) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Limit must be a positive number',
                    code: 'INVALID_LIMIT_PARAMETER'
                }
            });
        }

        const factory = new MongoDBDAOFactory();
        const genreDAO = factory.createGenreDAO();

        const genre = await genreDAO.findById(id);
        if (!genre) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Genre not found',
                    code: 'GENRE_NOT_FOUND'
                }
            });
        }

        let products;
        let totalProducts = 0;

        if (productType === 'song') {
            const songDAO = factory.createSongDAO();
            products = await songDAO.findByGenre(genre);
            totalProducts = products.length;
            products = products.slice((page - 1) * limit, page * limit);
        } else if (productType === 'album') {
            const albumDAO = factory.createAlbumDAO();
            const allAlbums = await albumDAO.getAll();
            const albumsWithTracks = [];

            for (const album of allAlbums) {
                const trackList = await albumDAO.getTrackList(album);

                if (trackList && trackList.length > 0) {
                    let hasGenre = false;

                    for (const track of trackList) {
                        if (track.genres && Array.isArray(track.genres)) {
                            if (track.genres.some((g: { _id: Types.ObjectId | string }) =>
                                g._id && g._id.toString() === id)) {
                                hasGenre = true;
                                break;
                            }
                        }
                    }

                    if (hasGenre) {
                        albumsWithTracks.push(album);
                    }
                }
            }

            totalProducts = albumsWithTracks.length;
            products = albumsWithTracks.slice((page - 1) * limit, page * limit);
        } else {
            const productDAO = factory.createProductDAO();
            products = await productDAO.getAll();
            totalProducts = products.length;
            products = products.slice((page - 1) * limit, page * limit);
        }

        const totalPages = Math.ceil(totalProducts / limit);

        const response = {
            genre,
            products,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalProducts,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        };

        res.status(200).json({
            success: true,
            msg: 'Products by genre retrieved successfully',
            data: response
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        res.status(500).json({
            success: false,
            error: {
                message: errorMessage,
                code: 'PRODUCT_FETCH_ERROR'
            }
        });
    }
};