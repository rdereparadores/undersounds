import { Document, model, Schema } from "mongoose"

interface IGenre extends Document {
    genre: string
}

const GenreSchema = new Schema<IGenre>({
    genre: { type: String, required: true, unique: true }
})

export const Genre = model<IGenre>('Genre', GenreSchema)