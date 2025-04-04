import { Document, Types } from 'mongoose';
import { IProduct } from './IProduct';

export interface IAlbum extends IProduct {
    // Relaciones
    track_list: Types.ObjectId[]; // Referencias a Song
    genres: Types.ObjectId[]; // Referencias a Genre
}