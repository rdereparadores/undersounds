import mongoose, { Document, Schema } from 'mongoose';
import { IAlbum } from './Album';
import { ISong } from './Song';
import { IUser } from './User';

export interface IScore extends Document {
    album?: mongoose.Types.ObjectId | IAlbum;
    song?: mongoose.Types.ObjectId | ISong;
    score: number;
    opinion: string;
    user: mongoose.Types.ObjectId | IUser;
    createdAt: Date;
    updatedAt: Date;
}

const ScoreSchema = new Schema({
    album: { type: Schema.Types.ObjectId, ref: 'Album' },
    song: { type: Schema.Types.ObjectId, ref: 'Song' },
    score: { type: Number, required: true, min: 0, max: 10 },
    opinion: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Validación para asegurarse de que al menos se valora una canción o un álbum, pero no ambos vacíos
ScoreSchema.pre('validate', function(next) {
    if (!this.album && !this.song) {
        next(new Error('Debe proporcionar un álbum o una canción para valorar'));
    } else {
        next();
    }
});

// Índice para evitar valoraciones duplicadas del mismo usuario
ScoreSchema.index({ user: 1, album: 1 }, { unique: true, sparse: true });
ScoreSchema.index({ user: 1, song: 1 }, { unique: true, sparse: true });

export default mongoose.model<IScore>('Score', ScoreSchema);