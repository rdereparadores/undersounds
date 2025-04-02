import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import CartItem from '../models/CartItem';
import Product from '../models/Product';
import UserAddress from '../models/UserAddress';
import UserPaymentMethod from '../models/UserPaymentMethod';
import Library from '../models/Library';

// Create new order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.params.userId;
        const { addressId, paymentMethodId, shippingAmount, itemIds = [] } = req.body;

        // Verify address exists and belongs to user
        const address = await UserAddress.findOne({
            _id: addressId,
            user_id: userId
        });

        if (!address) {
            await session.abortTransaction();
            session.endSession();
            res.status(404).json({
                success: false,
                message: 'Shipping address not found or does not belong to user'
            });
            return;
        }

        // Verify payment method exists and belongs to user
        const paymentMethod = await UserPaymentMethod.findOne({
            _id: paymentMethodId,
            user_id: userId
        });

        if (!paymentMethod) {
            await session.abortTransaction();
            session.endSession();
            res.status(404).json({
                success: false,
                message: 'Payment method not found or does not belong to user'
            });
            return;
        }

        // If specific items are provided, use them
        let cartItems;
        if (itemIds.length > 0) {
            cartItems = await CartItem.find({
                _id: { $in: itemIds },
                user_id: userId
            }).populate('product_id');
        } else {
            // Otherwise, use all items in the cart
            cartItems = await CartItem.find({
                user_id: userId
            }).populate('product_id');
        }

        if (cartItems.length === 0) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({
                success: false,
                message: 'No items in cart'
            });
            return;
        }

        // Calculate total amount
        let totalAmount = 0;
        for (const item of cartItems) {
            const product = item.product_id as any;
            let price = 0;

            // Get the price based on the format
            switch(item.format) {
                case 'digital':
                    price = product.price_digital;
                    break;
                case 'cd':
                    price = product.price_cd;
                    break;
                case 'vinyl':
                    price = product.price_vinyl;
                    break;
                case 'cassette':
                    price = product.price_cassette;
                    break;
            }

            totalAmount += price * item.quantity;
        }

        // Create order
        const order = new Order({
            user_id: userId,
            address_id: addressId,
            payment_method_id: paymentMethodId,
            total_amount: totalAmount,
            shipping_amount: shippingAmount,
            status: 'pending'
        });

        const savedOrder = await order.save({ session });

        // Create order items
        const orderItemPromises = cartItems.map(async (item) => {
            const product = item.product_id as any;
            let price = 0;

            // Get the price based on the format
            switch(item.format) {
                case 'digital':
                    price = product.price_digital;
                    break;
                case 'cd':
                    price = product.price_cd;
                    break;
                case 'vinyl':
                    price = product.price_vinyl;
                    break;
                case 'cassette':
                    price = product.price_cassette;
                    break;
            }

            const orderItem = new OrderItem({
                order_id: savedOrder._id,
                product_id: item.product_id,
                quantity: item.quantity,
                format: item.format,
                unit_price: price
            });

            const savedOrderItem = await orderItem.save({ session });

            // If digital format, add to library
            if (item.format === 'digital') {
                const library = new Library({
                    user_id: userId,
                    product_id: item.product_id,
                    format: 'digital',
                    added_at: new Date()
                });

                await library.save({ session });
            }

            return savedOrderItem;
        });

        await Promise.all(orderItemPromises);

        // Clear cart items that were used in this order
        if (itemIds.length > 0) {
            await CartItem.deleteMany({
                _id: { $in: itemIds },
                user_id: userId
            }, { session });
        } else {
            await CartItem.deleteMany({
                user_id: userId
            }, { session });
        }

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                orderId: savedOrder._id,
                totalAmount,
                shippingAmount,
                grandTotal: totalAmount + shippingAmount,
                status: savedOrder.status
            }
        });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();

        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
};

// Get user orders
export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;

        // Find all orders for the user
        const orders = await Order.find({ user_id: userId })
            .sort({ createdAt: -1 })
            .populate('address_id')
            .populate('payment_method_id');

        // Get item count for each order
        const ordersWithCount = await Promise.all(orders.map(async (order) => {
            const itemCount = await OrderItem.countDocuments({ order_id: order._id });
            return {
                ...order.toObject(),
                itemCount
            };
        }));

        res.status(200).json({
            success: true,
            count: ordersWithCount.length,
            data: ordersWithCount
        });
    } catch (error: any) {
        console.error('Error getting user orders:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting user orders',
            error: error.message
        });
    }
};

// Get order details
export const getOrderDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.orderId;
        const userId = req.params.userId;

        // Find the order and verify it belongs to the user
        const order = await Order.findOne({
            _id: orderId,
            user_id: userId
        })
            .populate('address_id')
            .populate('payment_method_id');

        if (!order) {
            res.status(404).json({
                success: false,
                message: 'Order not found or does not belong to user'
            });
            return;
        }

        // Get the items in the order
        const orderItems = await OrderItem.find({ order_id: orderId })
            .populate({
                path: 'product_id',
                select: 'title img_url type'
            });

        res.status(200).json({
            success: true,
            data: {
                order,
                items: orderItems
            }
        });
    } catch (error: any) {
        console.error('Error getting order details:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting order details',
            error: error.message
        });
    }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.orderId;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
            return;
        }

        // Update order status
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            res.status(404).json({
                success: false,
                message: 'Order not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: updatedOrder
        });
    } catch (error: any) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
};

// Get order items
export const getOrderItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.orderId;

        // Get the items in the order
        const orderItems = await OrderItem.find({ order_id: orderId })
            .populate({
                path: 'product_id',
                select: 'title img_url type'
            });

        res.status(200).json({
            success: true,
            count: orderItems.length,
            data: orderItems
        });
    } catch (error: any) {
        console.error('Error getting order items:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting order items',
            error: error.message
        });
    }
};