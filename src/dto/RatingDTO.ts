import { IRating } from "../models/Rating"

export interface RatingDTOProps {
    _id?: string,
    rating: number,
    title: string,
    description: string,
    publish_date: Date,
    author: string
}

export class RatingDTO implements RatingDTOProps {
    _id?: string
    rating: number
    title: string
    description: string
    publish_date: Date
    author: string

    constructor(props: RatingDTOProps) {
        this._id = props._id
        this.rating = props.rating
        this.title = props.title
        this.description = props.description
        this.publish_date = props.publish_date
        this.author = props.author
    }

    toJson(): RatingDTOProps {
        return {
            _id: this._id,
            rating: this.rating,
            title: this.title,
            description: this.description,
            publish_date: this.publish_date,
            author: this.author
        }
    }

    static fromDocument(doc: IRating) {
        return new RatingDTO({
            _id: doc._id.toString(),
            rating: doc.rating,
            title: doc.title,
            description: doc.description,
            publish_date: doc.publish_date,
            author: doc.author.toString()
        })
    }
}