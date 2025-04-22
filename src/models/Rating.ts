import { Document, model, Schema } from "mongoose"

export interface IRating extends Document {
    _id: Schema.Types.ObjectId,
    rating: number,
    title: string,
    description: string,
    publishDate: Date,
    author: Schema.Types.ObjectId,
    format: string
}

const RatingSchema = new Schema<IRating>({
    rating: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    publishDate: { type: Date, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'BaseUser', required: true },
    format: { type: String, required: true, enum: ['digital', 'cd', 'vinyl', 'cassette'] }
})

export const Rating = model<IRating>('Rating', RatingSchema)