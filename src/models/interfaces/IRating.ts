import { Document, Types } from 'mongoose';

export interface IRating extends Document {
    rating: number;
    title: string;
    description: string;
    publish_date: Date;
    // Relaciones
    author: Types.ObjectId; // Referencia a User
    product: Types.ObjectId; // Referencia a Product
}