import mongoose, { Document, Schema } from 'mongoose';
import { IUserAuth } from './UserAuth';
import { IProduct } from './Product';

export interface ICartItem extends Document {
    user_id: mongoose.Types.ObjectId | IUserAuth;
    product_id: mongoose.Types.ObjectId | IProduct;
    quantity: number;
    format: 'digital' | 'cd' | 'vinyl' | 'cassette';
    createdAt: Date;
    updatedAt: Date;
}

const CartItemSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'UserAuth', required: true },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
    format: { type: String, enum: ['digital', 'cd', 'vinyl', 'cassette'], required: true }
}, { timestamps: true });

// Índice para mejorar las consultas
CartItemSchema.index({ user_id: 1 });

// Índice compuesto para evitar duplicados del mismo producto/formato
CartItemSchema.index({ user_id: 1, product_id: 1, format: 1 }, { unique: true });

export default mongoose.model<ICartItem>('CartItem', CartItemSchema);