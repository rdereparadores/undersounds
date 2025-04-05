import mongoose, { Schema } from 'mongoose';
import { IRating } from './interfaces/IRating';

const RatingSchema: Schema = new Schema<IRating>({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    publish_date: { type: Date, required: true, default: Date.now },
    // Relaciones
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, { timestamps: true });

// Índices para búsquedas eficientes
RatingSchema.index({ author: 1 });
RatingSchema.index({ product: 1 });
RatingSchema.index({ rating: -1 }); // Para ordenar por mejor valoración
RatingSchema.index({ publish_date: -1 }); // Para ordenar por más recientes

// Índice compuesto para garantizar que un usuario solo pueda valorar un producto una vez
RatingSchema.index({ author: 1, product: 1 }, { unique: true });

export default mongoose.model<IRating>('Rating', RatingSchema);