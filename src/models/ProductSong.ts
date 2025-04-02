import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from './Product';

export interface IProductSong extends Document {
    album_id: mongoose.Types.ObjectId | IProduct;
    song_id: mongoose.Types.ObjectId | IProduct;
    track_number: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSongSchema = new Schema({
    album_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    song_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    track_number: { type: Number, required: true }
}, { timestamps: true });

// Índices para mejorar las consultas
ProductSongSchema.index({ album_id: 1, track_number: 1 });
ProductSongSchema.index({ song_id: 1 });

// Índice compuesto para evitar duplicados
ProductSongSchema.index({ album_id: 1, song_id: 1 }, { unique: true });

export default mongoose.model<IProductSong>('ProductSong', ProductSongSchema);