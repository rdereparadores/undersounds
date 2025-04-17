import { Document, model, Schema } from "mongoose"

export interface IBaseUser extends Document {
    _id: Schema.Types.ObjectId,
    name: string,
    surname: string,
    username: string,
    birthDate: Date,
    email: string,
    uid: string,
    imgUrl: string,
    userType: 'user' | 'artist',
    following: Schema.Types.ObjectId[],
    library: Schema.Types.ObjectId[],
    listeningHistory: Schema.Types.ObjectId[],
    addresses: {
        alias: string,
        name: string,
        surname: string,
        phone: number,
        address: string,
        address2: string,
        province: string,
        city: string,
        zipCode: number,
        country: string,
        observations: string,
        default: boolean
    }[]
}

export const BaseUserSchema = new Schema<IBaseUser>({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    birthDate: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    uid: { type: String, required: true, unique: true },
    imgUrl: { type: String, default: '/assets/img/profile/user/default.jpg' },
    following: [{ type: Schema.Types.ObjectId, ref: 'Artist' }],
    library: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    listeningHistory: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
    addresses: [{
        alias: { type: String, required: true, sparse: true },
        name: { type: String, required: true },
        surname: { type: String, required: true },
        phone: { type: Number, required: true },
        address: { type: String, required: true },
        address2: { type: String },
        province: { type: String, required: true },
        city: { type: String, required: true },
        zipCode: { type: Number, required: true },
        country: { type: String, required: true },
        observations: { type: String },
        default: { type: Boolean, required: true },
    }]
}, { discriminatorKey: 'userType' })

export const BaseUser = model<IBaseUser>('BaseUser', BaseUserSchema)