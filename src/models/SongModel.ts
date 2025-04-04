import mongoose, { Schema } from 'mongoose';
import { ISong } from './interfaces/ISong';

const SongSchema: Schema = new Schema<ISong>({
    song_dir: { type: String, required: true },
    plays: { type: Number, required: true, default: 0 },
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    // Relaciones
    performer: {
        type: Schema.Types.ObjectId,
        ref: 'Artist',
        required: true
    },
    collaborators: [{
        type: Schema.Types.ObjectId,
        ref: 'Artist'
    }],
    genres: [{
        type: Schema.Types.ObjectId,
        ref: 'Genre',
        required: true
    }]
}, {
    timestamps: true,
    versionKey: false
});

// Índices para búsquedas eficientes
SongSchema.index({ title: 1 });
SongSchema.index({ performer: 1 });
SongSchema.index({ collaborators: 1 });
SongSchema.index({ genres: 1 });
SongSchema.index({ plays: -1 }); // Para clasificar por más reproducidas

export default mongoose.model<ISong>('Song', SongSchema);