import mongoose, { Schema } from 'mongoose';
import { IProduct, IPricing } from './interfaces/IProduct';

export const PricingSchema: Schema = new Schema<IPricing>({
    cd: { type: Number, required: true },
    digital: { type: Number, required: true },
    cassette: { type: Number, required: true },
    vinyl: { type: Number, required: true }
}, { _id: false })

const ProductSchema: Schema = new Schema<IProduct>({
    title: { type: String, required: true },
    release_date: { type: Date, required: true },
    description: { type: String, required: true },
    img_url: { type: String, required: true },
    duration: { type: Number, required: true },
    pricing: { type: PricingSchema, required: true },
    performer: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
    product_type: { type: String, enum: ['Song', 'Album'], required: true }
}, { discriminatorKey: 'product_type', timestamps: true });

// Índices para búsquedas eficientes
ProductSchema.index({ title: 1 });
ProductSchema.index({ release_date: -1 });

// Crear el modelo base para Product
const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);

export default ProductModel;