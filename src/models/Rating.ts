import { Document, model, Schema } from "mongoose"

export interface IRating extends Document {
    _id: Schema.Types.ObjectId,
    rating: number,
    title: string,
    description: string,
    publishDate: Date,
    author: Schema.Types.ObjectId
}

const RatingSchema = new Schema<IRating>({
    rating: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    publishDate: { type: Date, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'BaseUser', required: true },
})

export const Rating = model<IRating>('Rating', RatingSchema)