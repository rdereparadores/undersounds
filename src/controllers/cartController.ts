import { Request, Response } from 'express';
import CartItem from '../models/CartItem';
import Product from '../models/Product';
import ShippingRate from '../models/ShippingRate';

// Get user's cart
export const getUserCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;

        // Find all cart items for the user
        const cartItems = await CartItem.find({ user_id: userId })
            .populate({
                path: 'product_id',
                select: 'type title img_url price_digital price_cd price_vinyl price_cassette'
            });

        // Calculate total cost
        let totalCost = 0;
        for (const item of cartItems) {
            const product = item.product_id as any;
            const format = item.format;
            let price = 0;

            // Get the price based on the format
            if (format === 'digital') price = product.price_digital;
            else if (format === 'cd') price = product.price_cd;
            else if (format === 'vinyl') price = product.price_vinyl;
            else if (format === 'cassette') price = product.price_cassette;

            totalCost += price * item.quantity;
        }

        // Get shipping cost
        let shippingCost = 0;
        if (totalCost > 0) {
            const shippingRate = await ShippingRate.findOne({
                minimum_order: { $lte: totalCost }
            }).sort({ minimum_order: -1 });

            if (shippingRate) {
                shippingCost = shippingRate.shipping_rate;
            }
        }

        res.status(200).json({
            success: true,
            data: {
                items: cartItems,
                itemCount: cartItems.length,
                totalCost,
                shippingCost,
                grandTotal: totalCost + shippingCost
            }
        });
    } catch (error: any) {
        console.error('Error getting user cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting user cart',
            error: error.message
        });
    }
};

// Add item to cart
export const addItemToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const { productId, quantity = 1, format } = req.body;

        // Validate format
        if (!['digital', 'cd', 'vinyl', 'cassette'].includes(format)) {
            res.status(400).json({
                success: false,
                message: 'Invalid format. Must be one of: digital, cd, vinyl, cassette'
            });
            return;
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found'
            });
            return;
        }

        // Check if the product has the requested format available
        let formatPrice: number | undefined;

        if (format === 'digital') {
            formatPrice = product.price_digital;
        } else if (format === 'cd') {
            formatPrice = product.price_cd;
        } else if (format === 'vinyl') {
            formatPrice = product.price_vinyl;
        } else if (format === 'cassette') {
            formatPrice = product.price_cassette;
        }

        if (formatPrice === undefined || formatPrice === null) {
            res.status(400).json({
                success: false,
                message: `This product is not available in ${format} format`
            });
            return;
        }

        // Check if item already exists in cart
        let cartItem = await CartItem.findOne({
            user_id: userId,
            product_id: productId,
            format
        });

        if (cartItem) {
            // Update quantity if item exists
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            // Create new cart item
            cartItem = new CartItem({
                user_id: userId,
                product_id: productId,
                quantity,
                format
            });
            await cartItem.save();
        }

        res.status(200).json({
            success: true,
            message: 'Item added to cart successfully',
            data: cartItem
        });
    } catch (error: any) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding item to cart',
            error: error.message
        });
    }
};

// Update cart item quantity
export const updateCartItemQuantity = async (req: Request, res: Response): Promise<void> => {
    try {
        const itemId = req.params.itemId;
        const userId = req.params.userId;
        const { quantity } = req.body;

        // Validate quantity
        if (quantity < 1) {
            res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
            return;
        }

        // Find and update the cart item
        const updatedItem = await CartItem.findOneAndUpdate(
            { _id: itemId, user_id: userId },
            { quantity },
            { new: true }
        ).populate('product_id');

        if (!updatedItem) {
            res.status(404).json({
                success: false,
                message: 'Cart item not found or does not belong to user'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Cart item quantity updated successfully',
            data: updatedItem
        });
    } catch (error: any) {
        console.error('Error updating cart item quantity:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating cart item quantity',
            error: error.message
        });
    }
};

// Remove item from cart
export const removeCartItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const itemId = req.params.itemId;
        const userId = req.params.userId;

        // Find and delete the cart item
        const deletedItem = await CartItem.findOneAndDelete({
            _id: itemId,
            user_id: userId
        });

        if (!deletedItem) {
            res.status(404).json({
                success: false,
                message: 'Cart item not found or does not belong to user'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Item removed from cart successfully'
        });
    } catch (error: any) {
        console.error('Error removing cart item:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing cart item',
            error: error.message
        });
    }
};

// Get shipping rates
export const getShippingRates = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderTotal } = req.query;

        let query = {};
        if (orderTotal) {
            query = { minimum_order: { $lte: Number(orderTotal) } };
        }

        const shippingRates = await ShippingRate.find(query).sort({ minimum_order: -1 });

        res.status(200).json({
            success: true,
            data: shippingRates
        });
    } catch (error: any) {
        console.error('Error getting shipping rates:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting shipping rates',
            error: error.message
        });
    }
};

// Clear cart
export const clearCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;

        await CartItem.deleteMany({ user_id: userId });

        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully'
        });
    } catch (error: any) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing cart',
            error: error.message
        });
    }
};