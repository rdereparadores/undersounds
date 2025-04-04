import mongoose, { Schema } from 'mongoose';
import { IUser } from './interfaces/IUser';

const AddressSchema = new Schema({
    alias: { type: String },
    address: { type: String, required: true },
    province: { type: String },
    city: { type: String },
    zip_code: { type: String },
    country: { type: String },
    observations: { type: String }
});

const UserSchema = new Schema({
    name: { type: String, required: true },
    sur_name: { type: String, required: true },
    birth_date: { type: Date },
    email: { type: String, required: true, unique: true },
    uid: { type: String, required: true },
    img_url: { type: String },
    address: [AddressSchema],
    role: { type: String, enum: ['user', 'artist'], required: true }
}, { timestamps: true, discriminatorKey: 'role' });

const User = mongoose.model<IUser>('User', UserSchema);

export default User;