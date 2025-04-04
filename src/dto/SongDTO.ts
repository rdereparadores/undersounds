/*import { ArtistResponseDTO } from './ArtistDTO';*/ // -- DESCOMENTAR CUANDO ARTISTDTO ESTE IMPLEMENTADO
import { GenreResponseDTO } from './GenreDTO';

// DTO para crear una canción
export interface CreateSongDTO {
    song_dir: string;
    title: string;
    duration: number;
    performer: string; // ID del artista principal
    collaborators?: string[]; // IDs de artistas colaboradores
    genres: string[]; // IDs de géneros
}

// DTO para actualizar una canción
export interface UpdateSongDTO {
    song_dir?: string;
    title?: string;
    duration?: number;
    performer?: string;
    collaborators?: string[];
    genres?: string[];
}

// DTO para agregar/quitar colaborador a la canción
export interface SongCollaboratorDTO {
    artistId: string;
}

// DTO para agregar/quitar género a la canción
export interface SongGenreDTO {
    genreId: string;
}

// DTO para respuesta de canciones
export interface SongResponseDTO {
    id: string;
    song_dir: string;
    title: string;
    duration: number;
    plays: number;
    /*performer: ArtistResponseDTO;
    collaborators: ArtistResponseDTO[];*/
    genres: GenreResponseDTO[];
    createdAt: Date;
    updatedAt: Date;
}

// DTO simplificado para respuestas anidadas
export interface SimpleSongResponseDTO {
    id: string;
    title: string;
    duration: number;
    plays: number;
}