import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    title: string;
    type: 'song' | 'album';
    img_url: string;
    description?: string;
    release_date: Date;
    price_digital: number;
    price_cd?: number;
    price_vinyl?: number;
    price_cassette?: number;
    popularity: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['song', 'album'], required: true },
    img_url: { type: String },
    description: { type: String },
    release_date: { type: Date, default: Date.now },
    price_digital: { type: Number, required: true },
    price_cd: { type: Number },
    price_vinyl: { type: Number },
    price_cassette: { type: Number },
    popularity: { type: Number, default: 0 },
}, { timestamps: true });

// Índices para búsquedas
ProductSchema.index({ title: 'text' });
ProductSchema.index({ release_date: -1 });
ProductSchema.index({ popularity: -1 });
ProductSchema.index({ type: 1 });

export default mongoose.model<IProduct>('Product', ProductSchema);