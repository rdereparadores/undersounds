import mongoose, { Document, Schema } from 'mongoose';
import { IUserAuth } from './UserAuth';

export interface IUserPaymentMethod extends Document {
    user_id: mongoose.Types.ObjectId | IUserAuth;
    alias: string;
    full_name: string;
    card_last_4_digits: string;
    expiry_month: number;
    expiry_year: number;
    is_default: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserPaymentMethodSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'UserAuth', required: true },
    alias: { type: String, required: true },
    full_name: { type: String, required: true },
    card_last_4_digits: { type: String, required: true },
    expiry_month: { type: Number, required: true },
    expiry_year: { type: Number, required: true },
    is_default: { type: Boolean, default: false }
}, { timestamps: true });

// Índice para mejorar las consultas
UserPaymentMethodSchema.index({ user_id: 1 });

export default mongoose.model<IUserPaymentMethod>('UserPaymentMethod', UserPaymentMethodSchema);