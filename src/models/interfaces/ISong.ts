import { Document, Types } from 'mongoose';
import { IGenre } from './IGenre';

export interface ISong extends Document {
    song_dir: string;
    plays: number;
    title: string;
    duration: number;
    // Relaciones
    performer: Types.ObjectId; // Referencia a Artist
    collaborators: Types.ObjectId[]; // Array de referencias a Artist
    genres: Types.ObjectId[]; // Array de referencias a Genre
}