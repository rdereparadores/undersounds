import { CreateProductDTO, UpdateProductDTO, ProductResponseDTO } from './ProductDTO';
import { SongResponseDTO } from './SongDTO';
import { GenreResponseDTO } from './GenreDTO';

// DTO para crear un álbum (extiende de CreateProductDTO)
export interface CreateAlbumDTO extends CreateProductDTO {
    track_list?: string[]; // IDs de canciones
    genres?: string[]; // IDs de géneros
}

// DTO para actualizar un álbum (extiende de UpdateProductDTO)
export interface UpdateAlbumDTO extends UpdateProductDTO {
    track_list?: string[]; // IDs de canciones
    genres?: string[]; // IDs de géneros
}

// DTO para agregar/quitar canción al álbum
export interface AlbumSongDTO {
    songId: string;
}

// DTO para agregar/quitar género al álbum
export interface AlbumGenreDTO {
    genreId: string;
}

// DTO para respuesta de álbumes (extiende de ProductResponseDTO)
export interface AlbumResponseDTO extends ProductResponseDTO {
    track_list: SongResponseDTO[];
    genres: GenreResponseDTO[];
}