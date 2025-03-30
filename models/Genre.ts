import mongoose, { Document, Schema } from 'mongoose';

export interface IGenre extends Document {
    genre: string;
}

const GenreSchema = new Schema({
    genre: { type: String, required: true, unique: true }
});

export default mongoose.model<IGenre>('Genre', GenreSchema);