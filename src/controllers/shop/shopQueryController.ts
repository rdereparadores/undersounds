import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

/**
 * @desc    Query store products with optional filters and load genres
 * @route   POST /api/store/query
 * @access  Public
 */
export const queryStore = async (req: Request, res: Response) => {
    try {
        const {
            genre,
            date,
            sort = 'releaseDate',
            page = 1,
            limit = 10
        } = req.body;

        const pageNumber = page;
        const limitNumber = limit;

        if (isNaN(pageNumber) || pageNumber < 1) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Page must be a positive number',
                    code: 'INVALID_PAGE_NUMBER'
                }
            });
        }

        if (isNaN(limitNumber) || limitNumber < 1) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Limit must be a positive number',
                    code: 'INVALID_LIMIT_NUMBER'
                }
            });
        }

        const skip = (pageNumber - 1) * limitNumber;

        const factory = new MongoDBDAOFactory();

        const genreDAO = factory.createGenreDAO();
        const productDAO = factory.createProductDAO();

        const genreName = typeof genre === 'string' ? genre : undefined;

        let dateFilter: 'today' | 'week' | 'month' | '3months' | '6months' | 'year' | undefined;
        if (date && ['today', 'week', 'month', '3months', '6months', 'year'].includes(date)) {
            dateFilter = date as 'today' | 'week' | 'month' | '3months' | '6months' | 'year';
        }

        let sortOption: 'relevance' | 'releaseDate' = 'releaseDate';
        if (sort === 'relevance') {
            sortOption = 'relevance';
        }

        const [allGenres, productsResult] = await Promise.all([
            genreDAO.getAll(),
            productDAO.findWithFilters(
                genreName,
                dateFilter,
                sortOption,
                skip,
                limitNumber
            )
        ]);

        const totalPages = Math.ceil(productsResult.totalCount / limitNumber);

        const response = {
            genres: allGenres,
            products: productsResult.products,
            filters: {
                genre: genreName,
                date: dateFilter
            },
            sorting: {
                type: sortOption
            },
            pagination: {
                currentPage: pageNumber,
                totalPages,
                totalItems: productsResult.totalCount,
                hasNextPage: pageNumber < totalPages,
                hasPrevPage: pageNumber > 1
            }
        };

        res.status(200).json({
            success: true,
            msg: 'Store data retrieved successfully',
            data: response
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        res.status(500).json({
            success: false,
            error: {
                message: errorMessage,
                code: 'STORE_QUERY_ERROR'
            }
        });
    }
};