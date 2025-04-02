import mongoose, { Document, Schema } from 'mongoose';
import { IUserAuth } from './UserAuth';
import { IProduct } from './Product';

export interface ILibrary extends Document {
    user_id: mongoose.Types.ObjectId | IUserAuth;
    product_id: mongoose.Types.ObjectId | IProduct;
    format: 'digital' | 'cd' | 'vinyl' | 'cassette';
    added_at: Date;
    createdAt: Date;
    updatedAt: Date;
}

const LibrarySchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'UserAuth', required: true },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    format: { type: String, enum: ['digital', 'cd', 'vinyl', 'cassette'], required: true },
    added_at: { type: Date, default: Date.now }
}, { timestamps: true });

// Índices para mejorar las consultas
LibrarySchema.index({ user_id: 1, added_at: -1 });

// Índice compuesto para evitar duplicados
LibrarySchema.index({ user_id: 1, product_id: 1, format: 1 }, { unique: true });

export default mongoose.model<ILibrary>('Library', LibrarySchema);