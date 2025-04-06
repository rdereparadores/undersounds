import mongoose, { Document, model, Schema, Types } from "mongoose";

export interface IRating extends Document {
    _id: Types.ObjectId,
    rating: number,
    title: string,
    description: string,
    publish_date: Date,
    author: Types.ObjectId
}

const RatingSchema = new Schema<IRating>({
    rating: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    publish_date: { type: Date, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

export const Rating = model<IRating>('Rating', RatingSchema)