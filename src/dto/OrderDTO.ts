import { IOrder } from "../models/Order"

export interface OrderDTOProps {
    purchase_date: Date,
    status?: 'processing' | 'shipped' | 'delivered',
    paid: boolean,
    tracking_number?: string,
    stripe_checkout_id: string,
    user: string,
    lines: {
        quantity: number,
        format: 'digital' | 'cd' | 'cassette' | 'vinyl',
        product: string,
        price: number
    }[]
}

export class OrderDTO implements OrderDTOProps {
    purchase_date: Date
    status?: 'processing' | 'shipped' | 'delivered'
    paid: boolean
    tracking_number?: string
    stripe_checkout_id: string
    user: string
    lines: {
        quantity: number,
        format: 'digital' | 'cd' | 'cassette' | 'vinyl',
        product: string,
        price: number
    }[]

    constructor(props: OrderDTOProps) {
        this.purchase_date = props.purchase_date
        this.status = props.status
        this.paid = props.paid
        this.tracking_number = props.tracking_number
        this.stripe_checkout_id = props.stripe_checkout_id
        this.user = props.user
        this.lines = props.lines
    }

    toJson(): OrderDTOProps {
        return {
            purchase_date: this.purchase_date,
            status: this.status,
            paid: this.paid,
            tracking_number: this.tracking_number,
            stripe_checkout_id: this.stripe_checkout_id,
            user: this.user,
            lines: this.lines
        }
    }
    
    static fromDocument(doc: IOrder) {
        return new OrderDTO({
            purchase_date: doc.purchase_date,
            status: doc.status,
            paid: doc.paid,
            tracking_number: doc.tracking_number,
            stripe_checkout_id: doc.stripe_checkout_id,
            user: doc.user.toString(),
            lines: doc.lines.map(line => ({
                quantity: line.quantity,
                format: line.format,
                product: line.product.toString(),
                price: line.price
            }))
        })
    }
}