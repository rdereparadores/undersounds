import mongoose, { Document, Schema } from 'mongoose';
import { IAddress } from './Address';
import { IGenre } from './Genre';

export interface IUser extends Document {
    name: string;
    birth_date: Date;
    email: string;
    phone: string;
    password: string;
    address: {
        _id: mongoose.Types.ObjectId;
        alias?: string;
        address: string;
        province?: string;
        city?: string;
        zip_code?: string;
        country?: string;
        observations?: string;
    }[];
    genres: mongoose.Types.ObjectId[] | IGenre[];
    createdAt: Date;
    updatedAt: Date;
    toObject(): any;
}

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
    birth_date: { type: Date },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    address: [AddressSchema],
    genres: [{ type: Schema.Types.ObjectId, ref: 'Genre' }]
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);