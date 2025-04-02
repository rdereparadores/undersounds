import { Request, Response } from 'express';
import ShippingRate from '../models/ShippingRate';

// Get all shipping rates
export const getShippingRates = async (_req: Request, res: Response): Promise<void> => {
    try {
        const shippingRates = await ShippingRate.find().sort({ minimum_order: 1 });

        res.status(200).json({
            success: true,
            count: shippingRates.length,
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

// Create a shipping rate
export const createShippingRate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { minimum_order, shipping_rate, description } = req.body;

        // Validate inputs
        if (minimum_order === undefined || shipping_rate === undefined) {
            res.status(400).json({
                success: false,
                message: 'Minimum order and shipping rate are required'
            });
            return;
        }

        // Check for duplicate minimum_order
        const existingRate = await ShippingRate.findOne({ minimum_order });
        if (existingRate) {
            res.status(400).json({
                success: false,
                message: 'A shipping rate with this minimum order already exists'
            });
            return;
        }

        const shippingRate = new ShippingRate({
            minimum_order,
            shipping_rate,
            description: description || `Orders $${minimum_order} and above`
        });

        const savedRate = await shippingRate.save();

        res.status(201).json({
            success: true,
            message: 'Shipping rate created successfully',
            data: savedRate
        });
    } catch (error: any) {
        console.error('Error creating shipping rate:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating shipping rate',
            error: error.message
        });
    }
};

// Get shipping rate by ID
export const getShippingRateById = async (req: Request, res: Response): Promise<void> => {
    try {
        const rateId = req.params.id;

        const shippingRate = await ShippingRate.findById(rateId);
        if (!shippingRate) {
            res.status(404).json({
                success: false,
                message: 'Shipping rate not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: shippingRate
        });
    } catch (error: any) {
        console.error('Error getting shipping rate:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting shipping rate',
            error: error.message
        });
    }
};

// Update shipping rate
export const updateShippingRate = async (req: Request, res: Response): Promise<void> => {
    try {
        const rateId = req.params.id;
        const { minimum_order, shipping_rate, description } = req.body;

        // Check if shipping rate exists
        const existingRate = await ShippingRate.findById(rateId);
        if (!existingRate) {
            res.status(404).json({
                success: false,
                message: 'Shipping rate not found'
            });
            return;
        }

        // Check for duplicate minimum_order that isn't this one
        if (minimum_order !== undefined && minimum_order !== existingRate.minimum_order) {
            const duplicateRate = await ShippingRate.findOne({
                minimum_order,
                _id: { $ne: rateId }
            });

            if (duplicateRate) {
                res.status(400).json({
                    success: false,
                    message: 'Another shipping rate with this minimum order already exists'
                });
                return;
            }
        }

        // Update the shipping rate
        const updatedRate = await ShippingRate.findByIdAndUpdate(
            rateId,
            {
                minimum_order: minimum_order !== undefined ? minimum_order : existingRate.minimum_order,
                shipping_rate: shipping_rate !== undefined ? shipping_rate : existingRate.shipping_rate,
                description: description !== undefined ? description : existingRate.description
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Shipping rate updated successfully',
            data: updatedRate
        });
    } catch (error: any) {
        console.error('Error updating shipping rate:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating shipping rate',
            error: error.message
        });
    }
};

// Delete shipping rate
export const deleteShippingRate = async (req: Request, res: Response): Promise<void> => {
    try {
        const rateId = req.params.id;

        // Check if shipping rate exists
        const existingRate = await ShippingRate.findById(rateId);
        if (!existingRate) {
            res.status(404).json({
                success: false,
                message: 'Shipping rate not found'
            });
            return;
        }

        await ShippingRate.findByIdAndDelete(rateId);

        res.status(200).json({
            success: true,
            message: 'Shipping rate deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting shipping rate:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting shipping rate',
            error: error.message
        });
    }
};

// Get applicable shipping rate for order amount
export const getApplicableShippingRate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { amount } = req.query;

        if (!amount || isNaN(Number(amount))) {
            res.status(400).json({
                success: false,
                message: 'Valid order amount is required'
            });
            return;
        }

        const orderAmount = Number(amount);

        // Find the shipping rate that applies (highest minimum_order that is less than or equal to amount)
        const shippingRate = await ShippingRate.findOne({
            minimum_order: { $lte: orderAmount }
        }).sort({ minimum_order: -1 });

        // If no shipping rate found, use the lowest one
        if (!shippingRate) {
            const lowestRate = await ShippingRate.findOne().sort({ minimum_order: 1 });

            res.status(200).json({
                success: true,
                data: lowestRate || { shipping_rate: 0, minimum_order: 0, description: 'Free shipping' }
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: shippingRate
        });
    } catch (error: any) {
        console.error('Error getting applicable shipping rate:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting applicable shipping rate',
            error: error.message
        });
    }
};