export interface ProductDTOProps {
    _id: string
    title: string
    release_date: Date
    description: string
    img_url: string
    duration: number
    pricing: {
        cd: number
        digital: number
        cassette: number
        vinyl: number
    }
    performer: string
    product_type: string
}

export class ProductDTO {
    _id!: string
    title!: string
    release_date!: Date
    description!: string
    img_url!: string
    duration!: number
    pricing!: {
        cd: number
        digital: number
        cassette: number
        vinyl: number
    }
    performer!: string
    product_type!: string

    constructor(props: ProductDTOProps) {
        Object.assign(this, props)
    }

    toJson() {
        return {
            ...this
        }
    }
}