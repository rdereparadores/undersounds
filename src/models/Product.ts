import { Document, model, Schema, trusted } from "mongoose"

export interface IProduct extends Document {
    _id: Schema.Types.ObjectId,
    title: string,
    releaseDate: Date,
    description: string,
    imgUrl: string,
    version: number,
    productType: 'song' | 'album',
    author: Schema.Types.ObjectId,
    duration: number,
    pricing: {
        cd: number,
        digital: number,
        cassette: number,
        vinyl: number
    },
    ratings: Schema.Types.ObjectId[]
}

export const ProductSchema = new Schema<IProduct>({
    title: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    description: { type: String, required: true },
    imgUrl: { type: String, required: true },
    version: { type: Number },
    productType: { type: String, enum: ['song', 'album'], required: true },
    author: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
    duration: {type: Number, required: true},
    pricing: {
        cd: { type: Number, required: true },
        digital: { type: Number, required: true },
        cassette: { type: Number, required: true },
        vinyl: { type: Number, required: true }
    },
    ratings: [{ type: Schema.Types.ObjectId, ref: 'Rating' }]
}, { discriminatorKey: 'productType' })

export const Product = model<IProduct>('Product', ProductSchema)