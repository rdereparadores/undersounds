import mongoose, { Document, Schema } from 'mongoose';

export interface IFormat extends Document {
    format: string;
}

const FormatSchema = new Schema({
    format: { type: String, required: true, unique: true }
});

export default mongoose.model<IFormat>('Format', FormatSchema);