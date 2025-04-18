import { IOrder } from "../models/Order"

export interface OrderDTOProps {
    _id?: string,
    purchaseDate: Date,
    status?: 'processing' | 'shipped' | 'delivered',
    paid: boolean,
    trackingNumber?: string,
    stripeCheckoutId: string,
    user: string,
    address: {
        name: string,
        surname: string,
        address: string,
        city: string,
        zipCode: string,
        country: string
    },
    lines: {
        quantity: number,
        format: 'digital' | 'cd' | 'cassette' | 'vinyl',
        product: string,
        price: number
    }[]
}

export class OrderDTO implements OrderDTOProps {
    _id?: string
    purchaseDate: Date
    status?: 'processing' | 'shipped' | 'delivered'
    paid: boolean
    trackingNumber?: string
    stripeCheckoutId: string
    user: string
    address: {
        name: string,
        surname: string,
        address: string,
        city: string,
        zipCode: string,
        country: string
    }
    lines: {
        quantity: number,
        format: 'digital' | 'cd' | 'cassette' | 'vinyl',
        product: string,
        price: number
    }[]

    constructor(props: OrderDTOProps) {
        this._id = props._id
        this.purchaseDate = props.purchaseDate
        this.status = props.status
        this.paid = props.paid
        this.trackingNumber = props.trackingNumber
        this.stripeCheckoutId = props.stripeCheckoutId
        this.user = props.user
        this.lines = props.lines
        this.address = props.address
    }

    toJson(): OrderDTOProps {
        return {
            purchaseDate: this.purchaseDate,
            status: this.status,
            paid: this.paid,
            trackingNumber: this.trackingNumber,
            stripeCheckoutId: this.stripeCheckoutId,
            user: this.user,
            lines: this.lines,
            address: this.address
        }
    }
    
    static fromDocument(doc: IOrder) {
        return new OrderDTO({
            purchaseDate: doc.purchaseDate,
            status: doc.status,
            paid: doc.paid,
            trackingNumber: doc.trackingNumber,
            stripeCheckoutId: doc.stripeCheckoutId,
            user: doc.user.toString(),
            address: doc.address,
            lines: doc.lines.map(line => ({
                quantity: line.quantity,
                format: line.format,
                product: line.product.toString(),
                price: line.price
            }))
        })
    }
}