import { Schema } from "mongoose"
import { IProduct, Product } from "./Product"

export interface IAlbum extends IProduct {
    trackList: Schema.Types.ObjectId[],
    versionHistory: Schema.Types.ObjectId[]
}

export const AlbumSchema = new Schema<IAlbum>({
    trackList: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
    versionHistory: [{ type: Schema.Types.ObjectId, ref: 'Album' }]
})

export const Album = Product.discriminator<IAlbum>('album', AlbumSchema)