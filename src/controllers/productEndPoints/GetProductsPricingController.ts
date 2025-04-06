import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';

export class PricingGetController {
    /**
     * @desc    Get product pricing
     * @route   GET /api/pricing/:productId
     * @access  Public
     */
    async getProductPricing(req: Request, res: Response, next: NextFunction) {
        try {
            const { productId } = req.params;

            const productDAO = req.db?.getProductDAO();
            if (!productDAO) {
                throw ApiError.internal('Database access error');
            }

            const product = await productDAO.findById(productId);

            if (!product) {
                throw ApiError.notFound('Product not found');
            }

            res.status(200).json(
                ApiResponse.success(product.pricing, 'Product pricing retrieved successfully')
            );
        } catch (error) {
            next(error);
        }
    }
}