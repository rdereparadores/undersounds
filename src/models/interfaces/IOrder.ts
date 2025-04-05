import { Types } from "mongoose"
import { IProduct } from "./IProduct"

export interface IOrderLine {
    quantity: number,
    product: Types.ObjectId
}

export interface IOrder extends Document {
    purchase_date: Date,
    status?: 'processing' | 'shipped' | 'delivered',
    paid: boolean,
    tracking_number?: string,
    lines: IOrderLine[]
}