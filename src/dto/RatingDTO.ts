import { IRating } from "../models/Rating"

export interface RatingDTOProps {
    _id?: string,
    rating: number,
    title: string,
    description: string,
    publishDate: Date,
    author: string,
    format: string
}

export class RatingDTO implements RatingDTOProps {
    _id?: string
    rating: number
    title: string
    description: string
    publishDate: Date
    author: string
    format: string

    constructor(props: RatingDTOProps) {
        this._id = props._id
        this.rating = props.rating
        this.title = props.title
        this.description = props.description
        this.publishDate = props.publishDate
        this.author = props.author
        this.format = props.format || 'digital'
    }

    toJson(): RatingDTOProps {
        return {
            _id: this._id,
            rating: this.rating,
            title: this.title,
            description: this.description,
            publishDate: this.publishDate,
            author: this.author,
            format: this.format
        }
    }

    static fromDocument(doc: IRating) {
        return new RatingDTO({
            _id: doc._id.toString(),
            rating: doc.rating,
            title: doc.title,
            description: doc.description,
            publishDate: doc.publishDate,
            author: doc.author.toString(),
            format: doc.format
        })
    }
}