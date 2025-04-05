import { GenreDTO } from './GenreDTO';
//import { ArtistDTO } from './ArtistDTO';

export interface SongDTO {
    id: string;
    song_dir: string;
    title: string;
    duration: number;
    plays: number;
//    performer: ArtistDTO;
//    collaborators: ArtistDTO[];
    genres: GenreDTO[];
    createdAt: Date;
    updatedAt: Date;
}