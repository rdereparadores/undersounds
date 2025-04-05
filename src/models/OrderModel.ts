import mongoose, { Schema } from "mongoose";
import { IOrder, IOrderLine } from "./interfaces/IOrder";

const OrderLineSchema = new Schema<IOrderLine>({
    quantity: { type: Number, required: true },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
})

const OrderSchema = new Schema<IOrder>({
    purchase_date: { type: Date, required: true },
    status: { type: String, enum: ['processing', 'shipped', 'paid'], required: true },
    paid: { type: Boolean, required: true },
    tracking_number: { type: String },
    lines: [OrderLineSchema]
})

export default mongoose.model<IOrder>('Order', OrderSchema);