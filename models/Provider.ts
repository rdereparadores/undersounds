import mongoose, { Document, Schema } from 'mongoose';

export interface IProvider extends Document {
    name: string;
    phone: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProviderSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String },
    address: { type: String }
}, { timestamps: true });

export default mongoose.model<IProvider>('Provider', ProviderSchema);