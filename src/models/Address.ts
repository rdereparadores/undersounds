import mongoose, { Document, Schema } from 'mongoose';

export interface IAddress extends Document {
    alias: string;
    address: string;
    province: string;
    city: string;
    zip_code: string;
    country: string;
    observations: string;
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

export default mongoose.model<IAddress>('Address', AddressSchema);