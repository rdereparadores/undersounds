import mongoose, { Document, Schema } from 'mongoose';
import { IUserAuth } from './UserAuth';

export interface IUserAddress extends Document {
    user_id: mongoose.Types.ObjectId | IUserAuth;
    alias: string;
    full_name: string;
    address: string;
    notes?: string;
    city: string;
    postal_code: string;
    country: string;
    phone: string;
    is_default: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserAddressSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'UserAuth', required: true },
    alias: { type: String, required: true },
    full_name: { type: String, required: true },
    address: { type: String, required: true },
    notes: { type: String },
    city: { type: String, required: true },
    postal_code: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    is_default: { type: Boolean, default: false }
}, { timestamps: true });

// Índice para mejorar las consultas
UserAddressSchema.index({ user_id: 1 });

export default mongoose.model<IUserAddress>('UserAddress', UserAddressSchema);