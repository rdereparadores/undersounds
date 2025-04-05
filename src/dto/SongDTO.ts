import { GenreResponseDTO } from './GenreDTO';

// Para cuando necesitamos solo datos básicos de un artista
export interface ArtistBasicDTO {
    id: string;
    artist_name: string;
    artist_user_name: string;
    img_url: string;
}

// Respuesta completa para canción
export interface SongResponseDTO {
    id: string;
    song_dir: string;
    title: string;
    duration: number;
    plays: number;
    performer: ArtistBasicDTO;
    collaborators: ArtistBasicDTO[];
    genres: GenreResponseDTO[];
    createdAt: Date;
    updatedAt: Date;
}

// Versión simplificada para usar en listas
export interface SimpleSongResponseDTO {
    id: string;
    title: string;
    duration: number;
    plays: number;
}

export interface CreateSongDTO {
    song_dir: string;
    title: string;
    duration: number;
    performer: string; // ID del artista
    collaborators?: string[]; // IDs de artistas colaboradores
    genres: string[]; // IDs de géneros
}

export interface UpdateSongDTO {
    song_dir?: string;
    title?: string;
    duration?: number;
    performer?: string; // ID del artista
    collaborators?: string[]; // IDs de artistas colaboradores
    genres?: string[]; // IDs de géneros
}