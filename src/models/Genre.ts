import { Document, model, Schema, Types } from "mongoose"

export interface IGenre extends Document {
    _id: Types.ObjectId,
    genre: string
}

const GenreSchema = new Schema<IGenre>({
    genre: { type: String, required: true, unique: true }
})

export const Genre = model<IGenre>('Genre', GenreSchema)