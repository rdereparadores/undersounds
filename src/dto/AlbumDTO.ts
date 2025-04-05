import { ProductResponseDTO } from './ProductDTO';
import { SongResponseDTO } from './SongDTO';
import { GenreResponseDTO } from './GenreDTO';

export interface AlbumResponseDTO extends ProductResponseDTO {
    track_list: SongResponseDTO[];
    genres: GenreResponseDTO[];
}

export interface CreateAlbumDTO {
    title: string;
    release_date: Date;
    description: string;
    img_url: string;
    duration: number;
    pricing: {
        cd: number;
        digital: number;
        cassette: number;
        vinyl: number;
    };
    track_list: string[]; // Array de IDs de canciones
    genres: string[]; // Array de IDs de géneros
}

export interface UpdateAlbumDTO {
    title?: string;
    release_date?: Date;
    description?: string;
    img_url?: string;
    duration?: number;
    pricing?: {
        cd?: number;
        digital?: number;
        cassette?: number;
        vinyl?: number;
    };
    track_list?: string[]; // Array de IDs de canciones
    genres?: string[]; // Array de IDs de géneros
}