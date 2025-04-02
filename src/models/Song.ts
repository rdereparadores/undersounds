import mongoose, { Document, Schema } from 'mongoose';
import { IGenre } from './Genre';
import { IFormat } from './Format';
import { IAlbum } from './Album';

export interface ISong extends Document {
    name: string;
    publish_date: Date;
    genre: mongoose.Types.ObjectId | IGenre;
    description: string;
    url_image: string;
    duration: number;
    url_song: string;
    format: mongoose.Types.ObjectId | IFormat;
    url_download: string;
    reproductions: number;
    album: mongoose.Types.ObjectId | IAlbum;
    createdAt: Date;
    updatedAt: Date;
}

const SongSchema = new Schema({
    name: { type: String, required: true },
    publish_date: { type: Date },
    genre: { type: Schema.Types.ObjectId, ref: 'Genre' },
    description: { type: String },
    url_image: { type: String },
    duration: { type: Number }, // en segundos
    url_song: { type: String },
    format: { type: Schema.Types.ObjectId, ref: 'Format' },
    url_download: { type: String },
    reproductions: { type: Number, default: 0 },
    album: { type: Schema.Types.ObjectId, ref: 'Album' }
}, { timestamps: true });

export default mongoose.model<ISong>('Song', SongSchema);