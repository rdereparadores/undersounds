import { Document, model, Schema } from "mongoose"

export interface IOrder extends Document {
    _id: Schema.Types.ObjectId,
    purchaseDate: Date,
    status: 'processing' | 'shipped' | 'delivered',
    paid: boolean,
    trackingNumber: string,
    stripeCheckoutId: string,
    user: Schema.Types.ObjectId,
    lines: {
        quantity: number,
        format: 'digital' | 'cd' | 'cassette' | 'vinyl',
        product: Schema.Types.ObjectId,
        price: number
    }[]
}

const OrderSchema = new Schema<IOrder>({
    purchaseDate: { type: Date, required: true },
    status: { type: String, enum: ['processing', 'shipped', 'delivered'] },
    paid: { type: Boolean, required: true },
    trackingNumber: { type: String },
    stripeCheckoutId: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lines: [{
        quantity: { type: Number, required: true },
        format: { type: String, enum: ['digital', 'cd', 'cassette', 'vinyl'], required: true },
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        price: { type: Number, required: true }
    }]
})

export const Order = model<IOrder>('Order', OrderSchema)