import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    sur_name: string;
    birth_date: Date;
    email: string;
    uid: string;
    img_url: string;
    address: {
        _id: mongoose.Types.ObjectId;
        alias: string;
        name: string;
        sur_name: string;
        phone: string;
        address: string;
        address_2?: string;
        province?: string;
        city?: string;
        zip_code?: number;
        country?: string;
        observations?: string;
    }[];

    //genres: mongoose.Types.ObjectId[] | IGenre[];
    role: 'user' | 'artist';
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
    sur_name: { type: String, required: true },
    birth_date: { type: Date },
    email: { type: String, required: true, unique: true },
    uid: { type: String, required: true },
    img_url: { type: String, required: false },
    address: [AddressSchema],
    role: { type: String, enum: ['user', 'artist'], required: true }
}, { timestamps: true, discriminatorKey: 'role' });

const User = mongoose.model<IUser>('User', UserSchema);

export default User;