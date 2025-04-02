import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from './Product';
import { IGenre } from './Genre';

export interface IProductGenre extends Document {
    product_id: mongoose.Types.ObjectId | IProduct;
    genre_id: mongoose.Types.ObjectId | IGenre;
    createdAt: Date;
    updatedAt: Date;
}

const ProductGenreSchema = new Schema({
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    genre_id: { type: Schema.Types.ObjectId, ref: 'Genre', required: true }
}, { timestamps: true });

// Índice compuesto para evitar duplicados
ProductGenreSchema.index({ product_id: 1, genre_id: 1 }, { unique: true });

export default mongoose.model<IProductGenre>('ProductGenre', ProductGenreSchema);