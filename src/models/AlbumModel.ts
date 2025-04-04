import mongoose, { Schema } from 'mongoose';
import { IAlbum } from './interfaces/IAlbum';
import ProductModel from './ProductModel';

// Schema para Album (extiende Product)
const AlbumSchema: Schema = new Schema<IAlbum>({
    // Los campos base ya están definidos en ProductSchema
    // Relaciones específicas de Album
    track_list: [{
        type: Schema.Types.ObjectId,
        ref: 'Song',
        required: true
    }],
    genres: [{
        type: Schema.Types.ObjectId,
        ref: 'Genre',
        required: true
    }]
});

// Crear modelo Album como discriminador de Product
const AlbumModel = ProductModel.discriminator<IAlbum>('Album', AlbumSchema);

export default AlbumModel;