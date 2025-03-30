import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { ISong } from './Song';

export interface IReproduction extends Document {
    user: mongoose.Types.ObjectId | IUser;
    song: mongoose.Types.ObjectId | ISong;
    createdAt: Date;
    updatedAt: Date;
}

const ReproductionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    song: { type: Schema.Types.ObjectId, ref: 'Song', required: true }
}, { timestamps: true });

export default mongoose.model<IReproduction>('Reproduction', ReproductionSchema);