import { Schema } from "mongoose"
import { IProduct, Product } from "./Product"

export interface ISong extends IProduct {
    songDir: string,
    plays: number,
    genres: Schema.Types.ObjectId[],
    collaborators: {
        artist: Schema.Types.ObjectId,
        accepted: boolean
    }[],
    versionHistory: Schema.Types.ObjectId[]
}

export const SongSchema = new Schema<ISong>({
    songDir: { type: String, required: true },
    plays: { type: Number, required: true },
    genres: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
    collaborators: [{
        artist: { type: Schema.Types.ObjectId, ref: 'Artist' },
        accepted: { type: Boolean, required: true, default: false }
    }],
    versionHistory: [{ type: Schema.Types.ObjectId, ref: 'Song' }]
})

export const Song = Product.discriminator<ISong>('song', SongSchema)