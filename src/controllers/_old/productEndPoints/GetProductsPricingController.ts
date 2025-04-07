import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../../factory/MongoDBDAOFactory';

/**
 * @desc    Get product pricing
 * @route   GET /api/pricing/:productId
 * @access  Public
 */
export const getProductPricing = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;

        const factory = new MongoDBDAOFactory();
        const productDAO = factory.createProductDAO();

        const product = await productDAO.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Product not found',
                    code: 'PRODUCT_NOT_FOUND'
                }
            });
        }

        res.status(200).json({
            success: true,
            msg: 'Product pricing retrieved successfully',
            data: product.pricing
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        res.status(500).json({
            success: false,
            error: {
                message: errorMessage,
                code: 'PRICING_FETCH_ERROR'
            }
        });
    }
};