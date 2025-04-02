import mongoose, { Document, Schema } from 'mongoose';
import { IUserAuth } from './UserAuth';
import { IUserAddress } from './UserAddress';
import { IUserPaymentMethod } from './UserPaymentMethod';

export interface IOrder extends Document {
    user_id: mongoose.Types.ObjectId | IUserAuth;
    address_id: mongoose.Types.ObjectId | IUserAddress;
    payment_method_id: mongoose.Types.ObjectId | IUserPaymentMethod;
    total_amount: number;
    shipping_amount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'UserAuth', required: true },
    address_id: { type: Schema.Types.ObjectId, ref: 'UserAddress', required: true },
    payment_method_id: { type: Schema.Types.ObjectId, ref: 'UserPaymentMethod', required: true },
    total_amount: { type: Number, required: true },
    shipping_amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

// Índices para mejorar las consultas
OrderSchema.index({ user_id: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

export default mongoose.model<IOrder>('Order', OrderSchema);