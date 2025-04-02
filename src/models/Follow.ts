import mongoose, { Document, Schema } from 'mongoose';
import { IUserAuth } from './UserAuth';
import { IArtist } from './Artist';

export interface IFollow extends Document {
    user_id: mongoose.Types.ObjectId | IUserAuth;
    artist_id: mongoose.Types.ObjectId | IArtist;
    createdAt: Date;
    updatedAt: Date;
}

const FollowSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'UserAuth', required: true },
    artist_id: { type: Schema.Types.ObjectId, ref: 'Artist', required: true }
}, { timestamps: true });

// Índice compuesto para evitar duplicados
FollowSchema.index({ user_id: 1, artist_id: 1 }, { unique: true });

export default mongoose.model<IFollow>('Follow', FollowSchema);