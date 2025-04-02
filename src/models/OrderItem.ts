import mongoose, { Document, Schema } from 'mongoose';
import { IOrder } from './Order';
import { IProduct } from './Product';

export interface IOrderItem extends Document {
    order_id: mongoose.Types.ObjectId | IOrder;
    product_id: mongoose.Types.ObjectId | IProduct;
    quantity: number;
    format: 'digital' | 'cd' | 'vinyl' | 'cassette';
    unit_price: number;
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema({
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    format: { type: String, enum: ['digital', 'cd', 'vinyl', 'cassette'], required: true },
    unit_price: { type: Number, required: true }
}, { timestamps: true });

// Índices para mejorar las consultas
OrderItemSchema.index({ order_id: 1 });
OrderItemSchema.index({ product_id: 1 });

export default mongoose.model<IOrderItem>('OrderItem', OrderItemSchema);