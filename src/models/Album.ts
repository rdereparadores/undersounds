import mongoose, { Document, Schema } from 'mongoose';
import { IGenre } from './Genre';
import { IFormat } from './Format';

export interface IAlbum extends Document {
    name: string;
    publish_date: Date;
    genre: mongoose.Types.ObjectId | IGenre;
    description: string;
    url_image: string;
    format: mongoose.Types.ObjectId | IFormat;
    url_download: string;
    createdAt: Date;
    updatedAt: Date;
}

const AlbumSchema = new Schema({
    name: { type: String, required: true },
    publish_date: { type: Date },
    genre: { type: Schema.Types.ObjectId, ref: 'Genre' },
    description: { type: String },
    url_image: { type: String },
    format: { type: Schema.Types.ObjectId, ref: 'Format' },
    url_download: { type: String }
}, { timestamps: true });

export default mongoose.model<IAlbum>('Album', AlbumSchema);