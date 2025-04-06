import mongoose, { model, Schema, Types } from "mongoose"

interface IOrder extends Document {
    _id: mongoose.Types.ObjectId,
    purchase_date: Date,
    status: 'processing' | 'shipped' | 'delivered',
    paid: boolean,
    tracking_number: string,
    stripe_checkout_id: string,
    user: Types.ObjectId,
    lines: {
        quantity: number,
        format: 'digital' | 'cd' | 'cassette' | 'vinyl',
        product: Types.ObjectId,
        price: number
    }[]
}

const OrderSchema = new Schema<IOrder>({
    purchase_date: { type: Date, required: true },
    status: { type: String, enum: ['processing', 'shipped', 'delivered'] },
    paid: { type: Boolean, required: true },
    tracking_number: { type: String },
    stripe_checkout_id: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lines: [{
        quantity: { type: Number, required: true },
        format: { type: String, enum: ['digital', 'cd', 'cassette', 'vinyl'], required: true },
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        price: { type: Number, required: true }
    }]
})

export const Order = model<IOrder>('Order', OrderSchema)