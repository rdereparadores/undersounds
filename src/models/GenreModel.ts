import mongoose, { Schema } from 'mongoose';
import { IGenre } from './interfaces/IGenre';

const GenreSchema: Schema = new Schema<IGenre>({
    genre: { type: String, required: true, unique: true }
}, {
    timestamps: true,
    versionKey: false
});

// Índice para búsquedas por género
GenreSchema.index({ genre: 1 });

export default mongoose.model<IGenre>('Genre', GenreSchema);