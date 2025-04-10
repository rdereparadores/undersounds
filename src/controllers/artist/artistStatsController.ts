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

        if (!artist || artist.user_type !== 'artist') {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Artist not found',
                    code: 'ARTIST_NOT_FOUND'
                }
            });
        }

        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const monthlySales = await artistDAO.getArtistMonthlySales(factory, artist.uid, currentMonthStart, now);
        const previousMonthSales = await artistDAO.getArtistMonthlySales(factory, artist.uid, previousMonthStart, previousMonthEnd);

        const salesChangePercentage = previousMonthSales.totalQuantity > 0
            ? Math.round(((monthlySales.totalQuantity - previousMonthSales.totalQuantity) / previousMonthSales.totalQuantity) * 100)
            : monthlySales.totalQuantity > 0 ? 100 : 0;

        const formatStats = calculatePreferredFormat(monthlySales.formatDistribution);

        const currentMonthListeners = await artistDAO.getListenersCount(factory, artist.uid, currentMonthStart, now);
        const previousMonthListeners = await artistDAO.getListenersCount(factory, artist.uid, previousMonthStart, previousMonthEnd);

        const listenersChangePercentage = previousMonthListeners > 0
            ? Math.round(((currentMonthListeners - previousMonthListeners) / previousMonthListeners) * 100)
            : currentMonthListeners > 0 ? 100 : 0;

        const formatSales = monthlySales.formatDistribution;

        const topProducts = await artistDAO.getTopSellingProducts(factory, artist.uid, 5, currentMonthStart, now);

        const response = {
            sales: {
                currentMonth: {
                    copies: monthlySales.totalQuantity,
                    changePercentage: salesChangePercentage,
                    revenue: monthlySales.totalRevenue
                }
            },
            preferredFormat: {
                topFormat: formatStats.preferredFormat,
                ratio: formatStats.ratio,
                formatDistribution: formatSales
            },
            listeners: {
                currentMonth: {
                    count: currentMonthListeners,
                    changePercentage: listenersChangePercentage
                }
            },
            topProducts: topProducts
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



function calculatePreferredFormat(formatDistribution: { format: string, quantity: number, revenue: number }[]): {
    preferredFormat: string;
    ratio: string;
} {
    let preferredFormat = 'digital';
    let maxCount = 0;
    let totalQuantity = 0;

    for (const item of formatDistribution) {
        totalQuantity += item.quantity;
        if (item.quantity > maxCount) {
            maxCount = item.quantity;
            preferredFormat = item.format;
        }
    }

    const ratio = totalQuantity > 0
        ? `${Math.round((maxCount / totalQuantity) * 10)} de cada 10 ventas`
        : 'No hay ventas';

    return {
        preferredFormat,
        ratio
    };
}