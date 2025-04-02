import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from './Product';
import { IArtist } from './Artist';

export interface IProductArtist extends Document {
    product_id: mongoose.Types.ObjectId | IProduct;
    artist_id: mongoose.Types.ObjectId | IArtist;
    createdAt: Date;
    updatedAt: Date;
}

const ProductArtistSchema = new Schema({
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    artist_id: { type: Schema.Types.ObjectId, ref: 'Artist', required: true }
}, { timestamps: true });

// Índice compuesto para evitar duplicados
ProductArtistSchema.index({ product_id: 1, artist_id: 1 }, { unique: true });

export default mongoose.model<IProductArtist>('ProductArtist', ProductArtistSchema);