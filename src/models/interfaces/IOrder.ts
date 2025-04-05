import { IProduct } from "./IProduct"

export interface IOrderLine {
    quantity: number,
    product: IProduct
}

export interface IOrder extends Document {
    purchase_date: Date,
    status?: 'processing' | 'shipped' | 'delivered',
    paid: boolean,
    tracking_number?: string,
    lines: IOrderLine[]
}