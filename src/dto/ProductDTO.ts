import { IProduct } from "../models/Product"

export interface ProductDTOProps {
    _id?: string,
    title: string,
    releaseDate: Date,
    description: string,
    imgUrl: string,
    version?: number,
    productType: 'song' | 'album',
    author: string,
    duration: number,
    genres: string[],
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
    releaseDate: Date
    description: string
    imgUrl: string
    version?: number
    productType: 'song' | 'album'
    author: string
    duration: number
    genres: string[]
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
        this.releaseDate = props.releaseDate
        this.description = props.description
        this.imgUrl = props.imgUrl
        this.version = props.version
        this.productType = props.productType
        this.author = props.author
        this.duration = props.duration
        this.genres = props.genres
        this.pricing = props.pricing
        this.ratings = props.ratings
    }

    toJson(): ProductDTOProps {
        return {
            _id: this._id,
            title: this.title,
            releaseDate: this.releaseDate,
            description: this.description,
            imgUrl: this.imgUrl,
            version: this.version,
            productType: this.productType,
            author: this.author,
            duration: this.duration,
            genres: this.genres,
            pricing: this.pricing,
            ratings: this.ratings
        }
    }

    static fromDocument(doc: IProduct): ProductDTO {
        return new ProductDTO({
            _id: doc._id.toString(),
            title: doc.title,
            releaseDate: doc.releaseDate,
            description: doc.description,
            imgUrl: doc.imgUrl,
            version: doc.version,
            productType: doc.productType,
            author: doc.author.toString(),
            duration: doc.duration,
            genres: doc.genres.map(genre => genre.toString()),
            pricing: doc.pricing,
            ratings: doc.ratings.map(rating => rating.toString())
        })
    }
}