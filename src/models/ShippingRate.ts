import mongoose, { Document, Schema } from 'mongoose';

export interface IShippingRate extends Document {
    minimum_order: number;
    shipping_rate: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const ShippingRateSchema = new Schema({
    minimum_order: { type: Number, required: true },
    shipping_rate: { type: Number, required: true },
    description: { type: String, required: true }
}, { timestamps: true });

// Índice para ordenar por minimum_order
ShippingRateSchema.index({ minimum_order: -1 });

export default mongoose.model<IShippingRate>('ShippingRate', ShippingRateSchema);