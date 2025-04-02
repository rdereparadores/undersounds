import mongoose, { Document, Schema } from 'mongoose';
import { IUserAuth } from './UserAuth';
import { IProduct } from './Product';

export interface IPlayHistory extends Document {
    user_id: mongoose.Types.ObjectId | IUserAuth;
    song_id: mongoose.Types.ObjectId | IProduct;
    played_at: Date;
    createdAt: Date;
    updatedAt: Date;
}

const PlayHistorySchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'UserAuth', required: true },
    song_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    played_at: { type: Date, default: Date.now }
}, { timestamps: true });

// Índices para mejorar las consultas
PlayHistorySchema.index({ user_id: 1, played_at: -1 });
PlayHistorySchema.index({ song_id: 1, played_at: -1 });

export default mongoose.model<IPlayHistory>('PlayHistory', PlayHistorySchema);