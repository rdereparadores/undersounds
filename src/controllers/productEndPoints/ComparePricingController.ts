import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';

/**
 * @desc    Compare pricing between products
 * @route   GET /api/pricing/compare
 * @access  Public
 */
export const compareProductsPricing = async (req: Request, res: Response) => {
    try {
        const { productIds } = req.query;

        if (!productIds || typeof productIds !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Product IDs are required (comma-separated)',
                    code: 'PRODUCT_IDS_REQUIRED'
                }
            });
        }

        const ids = productIds.split(',').map(id => id.trim());

        if (ids.length < 2) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'At least two product IDs are required for comparison',
                    code: 'INSUFFICIENT_PRODUCTS'
                }
            });
        }

        const factory = new MongoDBDAOFactory();
        const productDAO = factory.createProductDAO();

        const pricingComparison = [];

        for (const id of ids) {
            const product = await productDAO.findById(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: {
                        message: `Product with ID ${id} not found`,
                        code: 'PRODUCT_NOT_FOUND'
                    }
                });
            }

            pricingComparison.push({
                productId: product._id.toString(),
                title: product.title,
                pricing: product.pricing
            });
        }

        res.status(200).json({
            success: true,
            msg: 'Product pricing comparison retrieved successfully',
            data: pricingComparison
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        res.status(500).json({
            success: false,
            error: {
                message: errorMessage,
                code: 'PRICING_COMPARISON_ERROR'
            }
        });
    }
};