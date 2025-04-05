import mongoose, { Schema } from 'mongoose';
import { ISong } from './interfaces/ISong';
import { ISongVersion } from './interfaces/ISongVersion';
import { PricingSchema } from './ProductModel';

const SongVersionSchema: Schema = new Schema<ISongVersion>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    img_url: { type: String, required: true },
    duration: { type: Number, required: true },
    pricing: { type: PricingSchema, required: true },
    song_dir: { type: String, required: true },
    createdAt: { type: Date, required: true }
})

const SongSchema: Schema = new Schema<ISong>({
    song_dir: { type: String, required: true },
    plays: { type: Number, required: true, default: 0 },
    version_history: { type: [SongVersionSchema]},
    // Relaciones
    collaborators: [{
        type: Schema.Types.ObjectId,
        ref: 'Artist'
    }],
    genres: [{
        type: Schema.Types.ObjectId,
        ref: 'Genre',
        required: true
    }]
})

// Índices para búsquedas eficientes
SongSchema.index({ title: 1 })
SongSchema.index({ collaborators: 1 })
SongSchema.index({ genres: 1 })
SongSchema.index({ plays: -1 }) // Para clasificar por más reproducidas

export default mongoose.model<ISong>('Song', SongSchema)