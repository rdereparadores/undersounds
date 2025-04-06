import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { PricingDTO } from '../../dto/ProductDTO';

export class PricingCompareController {
    /**
     * @desc    Compare pricing between products
     * @route   GET /api/pricing/compare
     * @access  Public
     */
    async compareProductsPricing(req: Request, res: Response, next: NextFunction) {
        try {
            const { productIds } = req.query;

            if (!productIds || typeof productIds !== 'string') {
                throw ApiError.badRequest('Product IDs are required (comma-separated)');
            }

            const ids = productIds.split(',').map(id => id.trim());

            if (ids.length < 2) {
                throw ApiError.badRequest('At least two product IDs are required for comparison');
            }

            const productDAO = req.db?.getProductDAO();
            if (!productDAO) {
                throw ApiError.internal('Database access error');
            }

            const pricingComparison: Array<{
                productId: string;
                title: string;
                pricing: PricingDTO;
            }> = [];

            for (const id of ids) {
                const product = await productDAO.findById(id);

                if (!product) {
                    throw ApiError.notFound(`Product with ID ${id} not found`);
                }

                pricingComparison.push({
                    productId: product._id.toString(),
                    title: product.title,
                    pricing: product.pricing
                });
            }

            res.status(200).json(
                ApiResponse.success(pricingComparison, 'Product pricing comparison retrieved successfully')
            );
        } catch (error) {
            next(error);
        }
    }
}