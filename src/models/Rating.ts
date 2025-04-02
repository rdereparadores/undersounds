import mongoose, { Document, Schema } from 'mongoose';
import { IUserAuth } from './UserAuth';
import { IProduct } from './Product';

export interface IRating extends Document {
    user_id: mongoose.Types.ObjectId | IUserAuth;
    product_id: mongoose.Types.ObjectId | IProduct;
    rating: number;
    title?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const RatingSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'UserAuth', required: true },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    description: { type: String }
}, { timestamps: true });

// Índices para mejorar las consultas
RatingSchema.index({ product_id: 1, createdAt: -1 });

// Índice compuesto para evitar valoraciones duplicadas
RatingSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

export default mongoose.model<IRating>('Rating', RatingSchema);