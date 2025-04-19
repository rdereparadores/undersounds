import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

/**
 * @desc    Get artist dashboard statistics
 * @route   GET /api/artist/stats
 * @access  Private
 */
export const artistStatsController = async (req: Request, res: Response) => {
    try {
        const uid = req.body.uid;

        if (!uid || typeof uid !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Artist ID is required',
                    code: 'ARTIST_ID_REQUIRED'
                }
            });
        }

        const factory = new MongoDBDAOFactory();
        const artistDAO = factory.createArtistDAO();
        const artist = await artistDAO.findByUid(uid);

        if (!artist) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Artist not found',
                    code: 'ARTIST_NOT_FOUND'
                }
            });
        }

        // Calculate date ranges for monthly stats
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        // Get sales statistics
        const currentMonthSales = await artistDAO.getArtistMonthlySales(
            factory,
            artist._id!,
            currentMonthStart,
            now
        );

        const previousMonthSales = await artistDAO.getArtistMonthlySales(
            factory,
            artist._id!,
            previousMonthStart,
            previousMonthEnd
        );

        // Calculate percentage change in sales
        const salesChange = previousMonthSales.totalQuantity > 0
            ? Math.round(((currentMonthSales.totalQuantity - previousMonthSales.totalQuantity) / previousMonthSales.totalQuantity) * 100)
            : 100;

        // Get top selling products
        const topSellingProducts = await artistDAO.getTopSellingProducts(
            factory,
            artist._id!,
            5,
            currentMonthStart,
            now
        );

        // Format distribution for pie chart
        const formatDistribution = currentMonthSales.formatDistribution.map(format => ({
            format: format.format,
            quantity: format.quantity,
        }));

        // Get most sold format
        let mostSoldFormat = 'digital';
        let maxFormatQuantity = 0;

        for (const format of currentMonthSales.formatDistribution) {
            if (format.quantity > maxFormatQuantity) {
                maxFormatQuantity = format.quantity;
                mostSoldFormat = format.format;
            }
        }

        // Calculate format ratio
        const formatRatio = currentMonthSales.totalQuantity > 0
            ? `${Math.round((maxFormatQuantity / currentMonthSales.totalQuantity) * 10)} de cada 10 compras`
            : 'No hay ventas';

        // Get listeners count
        const currentMonthListeners = await artistDAO.getListenersCount(
            factory,
            artist._id!,
            currentMonthStart,
            now
        );

        const previousMonthListeners = await artistDAO.getListenersCount(
            factory,
            artist._id!,
            previousMonthStart,
            previousMonthEnd
        );

        // Calculate percentage change in listeners
        const listenersChange = previousMonthListeners > 0
            ? Math.round(((currentMonthListeners - previousMonthListeners) / previousMonthListeners) * 100)
            : 100;

        // Prepare response object with all statistics
        const response = {
            salesStats: {
                totalSales: currentMonthSales.totalQuantity,
                changePercentage: salesChange,
                totalRevenue: currentMonthSales.totalRevenue
            },
            formatStats: {
                mostSoldFormat: mostSoldFormat,
                formatRatio: formatRatio,
                formatDistribution: formatDistribution
            },
            listenerStats: {
                uniqueListeners: currentMonthListeners,
                changePercentage: listenersChange
            },
            topSellingProducts: topSellingProducts.map(product => ({
                title: product.title,
                quantity: product.quantity,
                revenue: product.revenue,
            }))
        };

        res.status(200).json({
            success: true,
            msg: 'Artist statistics retrieved successfully',
            data: response
        });
    } catch (error) {
        console.error('Error in artistStatsController:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        res.status(500).json({
            success: false,
            error: {
                message: errorMessage,
                code: 'STATS_FETCH_ERROR'
            }
        });
    }
};