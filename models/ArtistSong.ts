import mongoose, { Document, Schema } from 'mongoose';
import { IArtist } from './Artist';
import { ISong } from './Song';

export interface IArtistSong extends Document {
    artist: mongoose.Types.ObjectId | IArtist;
    song: mongoose.Types.ObjectId | ISong;
    createdAt: Date;
    updatedAt: Date;
}

const ArtistSongSchema = new Schema({
    artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
    song: { type: Schema.Types.ObjectId, ref: 'Song', required: true }
}, { timestamps: true });

// Índice compuesto para evitar duplicados
ArtistSongSchema.index({ artist: 1, song: 1 }, { unique: true });

export default mongoose.model<IArtistSong>('ArtistSong', ArtistSongSchema);