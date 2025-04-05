import mongoose, { Schema } from 'mongoose'
import { IBaseUser } from './interfaces/IBaseUser'

const AddressSchema = new Schema({
    alias: { type: String, required: true },
    name: { type: String, required: true },
    sur_name: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    address_2: { type: String },
    province: { type: String, required: true },
    city: { type: String, required: true },
    zip_code: { type: Number, required: true },
    country: { type: String, required: true },
    observations: { type: String }
})

const BaseUserSchema = new Schema({
    name: { type: String, required: true },
    sur_name: { type: String, required: true },
    birth_date: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    uid: { type: String, required: true, unique: true },
    img_url: { type: String },
    addresses: [AddressSchema],
    role: { type: String, enum: ['User', 'Artist'], required: true }
}, { discriminatorKey: 'role' })

const BaseUser = mongoose.model<IBaseUser>('BaseUser', BaseUserSchema)

export default BaseUser