import { Schema, Types } from "mongoose";
import { IProduct, Product } from "./Product";

export interface ISong extends IProduct {
    song_dir: string,
    duration: number,
    plays: number,
    genres: Types.ObjectId[],
    collaborators: {
        artist: Types.ObjectId,
        accepted: boolean
    }[],
    version_history: Types.ObjectId[]
}

export const SongSchema = new Schema<ISong>({
    song_dir: { type: String, required: true },
    duration: { type: Number, required: true },
    plays: { type: Number, required: true },
    genres: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
    collaborators: [{
        artist: { type: Schema.Types.ObjectId, ref: 'Artist' },
        accepted: { type: Boolean, required: true, default: false }
    }],
    version_history: [{ type: Schema.Types.ObjectId, ref: 'Song' }]
})

export const Song = Product.discriminator<ISong>('song', SongSchema)