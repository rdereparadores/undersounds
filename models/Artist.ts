import mongoose, { Document, Schema } from 'mongoose';
import { IAddress } from './Address';

export interface IArtist extends Document {
    artist_name: string;
    real_name: string;
    birth_date: Date;
    email: string;
    password: string;
    record_label: string;
    address: mongoose.Types.ObjectId[];
    bank_account: string;
    createdAt: Date;
    updatedAt: Date;
    toObject(): any;
}

const ArtistSchema = new Schema({
    artist_name: { type: String, required: true },
    real_name: { type: String },
    birth_date: { type: Date },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    record_label: { type: String },
    address: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
    bank_account: { type: String }
}, { timestamps: true });

export default mongoose.model<IArtist>('Artist', ArtistSchema);
