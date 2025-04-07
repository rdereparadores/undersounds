import mongoose, { Schema, Types } from "mongoose";
import { IProduct, Product } from "./Product";

export interface IAlbum extends IProduct {
    _id: mongoose.Types.ObjectId,
    track_list: Types.ObjectId[],
    version_history: Types.ObjectId[]
}

export const AlbumSchema = new Schema<IAlbum>({
    track_list: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
    version_history: [{ type: Schema.Types.ObjectId, ref: 'Album' }]
})

export const Album = Product.discriminator<IAlbum>('album', AlbumSchema)