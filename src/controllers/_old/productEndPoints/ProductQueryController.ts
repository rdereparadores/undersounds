import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../../utils/ApiResponse';
import { ApiError } from '../../../utils/ApiError';
import { MapperUtils } from '../../utils/MapperUtils';

export class ProductQueryController {
    /**
     * @desc    Search for products (songs, albums) with various filters
     * @route   GET /api/products/query
     * @access  Public
     */
    async queryProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                query,
                artist,
                startDate,
                endDate,
                genres,
                sortBy = 'releaseDate',
                sortOrder = 'desc',
                page = '1',
                limit = '10',
                productType
            } = req.query;

            const pageNumber = parseInt(page as string);
            const limitNumber = parseInt(limit as string);

            if (isNaN(pageNumber) || pageNumber < 1) {
                throw ApiError.badRequest('Page must be a positive number');
            }

            if (isNaN(limitNumber) || limitNumber < 1) {
                throw ApiError.badRequest('Limit must be a positive number');
            }

            // Build filter object
            const filter: any = {};

            // Add text search if query provided
            if (query && typeof query === 'string') {
                filter.title = { $regex: query, $options: 'i' };
            }

            // Add artist filter if provided
            if (artist && typeof artist === 'string') {
                // This might need to be adjusted based on how artists are stored in products
                filter.artist = artist;
            }

            // Add date range filter if provided
            if (startDate && endDate) {
                filter.release_date = {
                    $gte: new Date(startDate as string),
                    $lte: new Date(endDate as string)
                };
            }

            // Add genre filter if provided
            if (genres) {
                const genreList = (genres as string).split(',');
                filter.genres = { $in: genreList };
            }

            // Add product type filter if provided (Album, Song, etc)
            if (productType && typeof productType === 'string') {
                filter.product_type = productType;
            }

            // Determine sort options
            const sortOptions: any = {};

            switch (sortBy) {
                case 'price':
                    sortOptions['pricing.digital'] = sortOrder === 'asc' ? 1 : -1;
                    break;
                case 'releaseDate':
                    sortOptions.release_date = sortOrder === 'asc' ? 1 : -1;
                    break;
                case 'popularity':
                    // This might need to be adjusted based on how popularity is measured
                    sortOptions.plays = sortOrder === 'asc' ? 1 : -1;
                    break;
                case 'title':
                    sortOptions.title = sortOrder === 'asc' ? 1 : -1;
                    break;
                default:
                    sortOptions.release_date = -1; // Default sort by release date desc
            }

            const productDAO = req.db?.getProductDAO();
            if (!productDAO) {
                throw ApiError.internal('Database access error');
            }

            const skip = (pageNumber - 1) * limitNumber;
            const products = await productDAO.findByFilterWithPagination(
                filter,
                sortOptions,
                skip,
                limitNumber
            );

            const totalProducts = await productDAO.countByFilter(filter);
            const totalPages = Math.ceil(totalProducts / limitNumber);

            // Convert products to DTOs
            const productDTOs = products.map(product => {
                if (product.product_type === 'Album') {
                    return MapperUtils.toAlbumDTO(product as unknown as IAlbum);
                }
                return MapperUtils.toProductDTO(product);
            });

            const response = {
                products: productDTOs,
                pagination: {
                    currentPage: pageNumber,
                    totalPages,
                    totalItems: totalProducts,
                    hasNextPage: pageNumber < totalPages,
                    hasPrevPage: pageNumber > 1
                }
            };

            res.status(200).json(
                ApiResponse.success(response, 'Products retrieved successfully')
            );
        } catch (error) {
            next(error);
        }
    }
}