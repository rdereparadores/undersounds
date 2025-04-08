import { Document, model, Schema, Types } from "mongoose";

export interface IBaseUser extends Document {
    _id: Types.ObjectId,
    name: string,
    sur_name: string,
    user_name: string,
    birth_date: Date,
    email: string,
    uid: string,
    img_url: string,
    user_type: 'user' | 'artist',
    following: Types.ObjectId[],
    library: Types.ObjectId[],
    listening_history: Types.ObjectId[],
    addresses: {
        _id: Types.ObjectId,
        alias: string,
        name: string,
        sur_name: string,
        phone: number,
        address: string,
        address_2: string,
        province: string,
        city: string,
        zip_code: number,
        country: string,
        observations: string,
        default: boolean
    }[]
}

export const BaseUserSchema = new Schema<IBaseUser>({
    name: { type: String, required: true },
    sur_name: { type: String, required: true },
    user_name: { type: String, required: true, unique: true },
    birth_date: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    uid: { type: String, required: true, unique: true },
    img_url: { type: String, default: '/assets/img/profile/user/default.jpg' },
    following: [{ type: Schema.Types.ObjectId, ref: 'Artist' }],
    library: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    listening_history: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
    addresses: [{
        alias: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        sur_name: { type: String, required: true },
        phone: { type: Number, required: true },
        address: { type: String, required: true },
        address_2: { type: String },
        province: { type: String, required: true },
        city: { type: String, required: true },
        zip_code: { type: Number, required: true },
        country: { type: String, required: true },
        observations: { type: String },
        default: { type: Boolean, required: true },
    }]
}, { discriminatorKey: 'user_type' })

export const BaseUser = model<IBaseUser>('BaseUser', BaseUserSchema)