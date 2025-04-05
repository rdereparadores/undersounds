import mongoose, { Schema } from 'mongoose';
import { IAlbum } from './interfaces/IAlbum';
import ProductModel, { PricingSchema } from './ProductModel';
import { IAlbumVersion } from './interfaces/IAlbumVersion';

const AlbumVersionSchema: Schema = new Schema<IAlbumVersion>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    img_url: { type: String, required: true },
    duration: { type: Number, required: true },
    pricing: { type: PricingSchema, required: true },
    track_list: [{
        type: Schema.Types.ObjectId,
        ref: 'Song',
        required: true
    }],
    createdAt: { type: Date, required: true }
})

const AlbumSchema: Schema = new Schema<IAlbum>({
    track_list: [{
        type: Schema.Types.ObjectId,
        ref: 'Song',
        required: true
    }],
    version_history: [AlbumVersionSchema]
});

// Crear modelo Album como discriminador de Product
const AlbumModel = ProductModel.discriminator<IAlbum>('Album', AlbumSchema);

export default AlbumModel;