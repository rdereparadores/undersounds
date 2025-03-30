import mongoose, { Document, Schema } from 'mongoose';

export interface IPaymentMethod extends Document {
    titular: string;
    card_number: string;
    cvv: string;
    month: number;
    year: number;
    alias: string;
    createdAt: Date;
    updatedAt: Date;
    toObject(): any;
}

const PaymentMethodSchema = new Schema({
    titular: { type: String, required: true },
    card_number: { type: String, required: true },
    cvv: { type: String, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    alias: { type: String }
}, { timestamps: true });

export default mongoose.model<IPaymentMethod>('PaymentMethod', PaymentMethodSchema);