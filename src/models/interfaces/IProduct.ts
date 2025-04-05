import { Document, Types } from 'mongoose';

export interface IPricing {
    cd: number
    digital: number
    cassette: number
    vinyl: number
}

export interface IProduct extends Document {
    title: string
    release_date: Date
    description: string
    img_url: string
    duration: number
    pricing: IPricing
    performer: Types.ObjectId
    product_type: 'Song' | 'Album'
}