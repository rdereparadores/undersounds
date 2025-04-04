import { Document } from 'mongoose';

// Pricing como subdocumento embebido en Product
export interface IPricing {
    cd: number;
    digital: number;
    cassette: number;
    vinyl: number;
}

export interface IProduct extends Document {
    title: string;
    release_date: Date;
    description: string;
    img_url: string;
    duration: number;
    pricing: IPricing;
}