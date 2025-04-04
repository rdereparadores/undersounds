import { Document } from 'mongoose';

export interface IAddress {
    alias: string;
    name: string;
    sur_name: string;
    phone: string;
    address: string;
    address_2?: string;
    province: string;
    city: string;
    zip_code: number;
    country: string;
    observations?: string;
}

export interface IUser extends Document {
    name: string;
    sur_name: string;
    birth_date: Date;
    email: string;
    uid: string;
    img_url: string;
    address: IAddress[];
    role: 'user' | 'artist';
    createdAt: Date;
    updatedAt: Date;
}