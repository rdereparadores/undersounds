import { IProduct, Product } from "../models/Product"

export interface ProductDTOProps {
    _id?: string,
    title: string,
    release_date: Date,
    description: string,
    img_url: string,
    version?: number,
    product_type: 'song' | 'album',
    author: string,
    pricing: {
        cd: number,
        digital: number,
        cassette: number,
        vinyl: number
    },
    ratings: string[]
}

export class ProductDTO implements ProductDTOProps {
    _id?: string
    title: string
    release_date: Date
    description: string
    img_url: string
    version?: number
    product_type: 'song' | 'album'
    author: string
    pricing: {
        cd: number
        digital: number
        cassette: number
        vinyl: number
    }
    ratings: string[]

    constructor(props: ProductDTOProps) {
        this._id = props._id
        this.title = props.title
        this.release_date = props.release_date
        this.description = props.description
        this.img_url = props.img_url
        this.version = props.version
        this.product_type = props.product_type
        this.author = props.author
        this.pricing = props.pricing
        this.ratings = props.ratings
    }

    toJson(): ProductDTOProps {
        return {
            _id: this._id,
            title: this.title,
            release_date: this.release_date,
            description: this.description,
            img_url: this.img_url,
            version: this.version,
            product_type: this.product_type,
            author: this.author,
            pricing: this.pricing,
            ratings: this.ratings
        }
    }

    static fromDocument(doc: IProduct): ProductDTO {
        return new ProductDTO({
            _id: doc._id.toString(),
            title: doc.title,
            release_date: doc.release_date,
            description: doc.description,
            img_url: doc.img_url,
            version: doc.version,
            product_type: doc.product_type,
            author: doc.author.toString(),
            pricing: doc.pricing,
            ratings: doc.ratings.map(rating => rating.toString())
        })
    }
}