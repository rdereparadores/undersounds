import mongoose, { Document, model, Schema, Types } from "mongoose";

export interface IProduct extends Document {
    _id: mongoose.Types.ObjectId,
    title: string,
    release_date: Date,
    description: string,
    img_url: string,
    version: number,
    product_type: 'song' | 'album',
    author: Types.ObjectId,
    pricing: {
        cd: number,
        digital: number,
        cassette: number,
        vinyl: number
    },
    ratings: Types.ObjectId[]
}

export const ProductSchema = new Schema<IProduct>({
    title: { type: String, required: true },
    release_date: { type: Date, required: true },
    description: { type: String, required: true },
    img_url: { type: String, required: true },
    version: { type: Number },
    product_type: { type: String, enum: ['song', 'album'], required: true },
    author: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
    pricing: {
        cd: { type: Number, required: true },
        digital: { type: Number, required: true },
        cassette: { type: Number, required: true },
        vinyl: { type: Number, required: true }
    },
    ratings: [{ type: Schema.Types.ObjectId, ref: 'Rating' }]
}, { discriminatorKey: 'product_type' })

export const Product = model<IProduct>('Product', ProductSchema)