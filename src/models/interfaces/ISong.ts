import { Document, Types } from 'mongoose';
import { ISongVersion } from './ISongVersion';
import { IProduct } from './IProduct';

export interface ISong extends IProduct {
    song_dir: string,
    plays: number,
    version_history: ISongVersion[],
    // Relaciones
    collaborators: Types.ObjectId[], // Array de referencias a Artist
    genres: Types.ObjectId[], // Array de referencias a Genre
}