import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import {Types} from "mongoose";

export class GetProductsByGenreController {
    /**
     * @desc    Get products by genre
     * @route   GET /api/genres/:id/products
     * @access  Public
     */
    async getProductsByGenre(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { productType } = req.query;
            const page = parseInt(req.query.page as string || '1');
            const limit = parseInt(req.query.limit as string || '10');

            if (isNaN(page) || page < 1) {
                throw ApiError.badRequest('Page must be a positive number');
            }

            if (isNaN(limit) || limit < 1) {
                throw ApiError.badRequest('Limit must be a positive number');
            }

            const genreDAO = new GenreDAO();
            const genre = await genreDAO.findById(id);

            if (!genre) {
                throw ApiError.notFound('Genre not found');
            }

            let products;
            let totalProducts = 0;

            if (productType === 'song') {
                const songDAO = new SongDAO();
                const genreDTO = new GenreDTO({ _id: id, genre: genre.genre });
                products = await songDAO.findByGenre(genreDTO);
                // Aplicar paginación manualmente
                totalProducts = products.length;
                products = products.slice((page - 1) * limit, page * limit);
            } else if (productType === 'album') {
                const albumDAO = new AlbumDAO();
                const songDAO = new SongDAO();
                const genreDTO = new GenreDTO({ _id: id, genre: genre.genre });

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
                const productDAO = new ProductDAO();
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

            res.status(200).json(
                ApiResponse.success(response, 'Products by genre retrieved successfully')
            );
        } catch (error) {
            next(error);
        }
    }
}