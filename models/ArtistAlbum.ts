import mongoose, { Document, Schema } from 'mongoose';
import { IArtist } from './Artist';
import { IAlbum } from './Album';

export interface IArtistAlbum extends Document {
    artist: mongoose.Types.ObjectId | IArtist;
    album: mongoose.Types.ObjectId | IAlbum;
    createdAt: Date;
    updatedAt: Date;
}

const ArtistAlbumSchema = new Schema({
    artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
    album: { type: Schema.Types.ObjectId, ref: 'Album', required: true }
}, { timestamps: true });

// Índice compuesto para evitar duplicados
ArtistAlbumSchema.index({ artist: 1, album: 1 }, { unique: true });

export default mongoose.model<IArtistAlbum>('ArtistAlbum', ArtistAlbumSchema);