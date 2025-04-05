import { Document, Types } from 'mongoose';
import { ISongVersion } from './ISongVersion';

export interface ISong extends Document {
    song_dir: string,
    plays: number,
    version_history: ISongVersion[],
    // Relaciones
    collaborators: Types.ObjectId[], // Array de referencias a Artist
    genres: Types.ObjectId[], // Array de referencias a Genre
}