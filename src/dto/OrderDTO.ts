import { ProductDTOProps } from "./ProductDTO"

export interface OrderDTOProps {
    purchase_date: Date,
    status?: 'processing' | 'shipped' | 'delivered',
    paid: boolean,
    tracking_number?: string,
    lines: {
        quantity: number,
        product: ProductDTOProps
    }[]
}

export class OrderDTO implements OrderDTOProps{
    purchase_date!: Date
    status?: 'processing' | 'shipped' | 'delivered'
    paid!: boolean
    tracking_number?: string
    lines!: {
        quantity: number,
        product: ProductDTOProps
    }[]

    constructor(props: OrderDTOProps) {
        Object.assign(this, props)
    }

    toJson() {
        return {
            ...this
        }
    }
}