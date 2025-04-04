// DTOs para Genre

// DTO para crear un género
export interface CreateGenreDTO {
    genre: string;
}

// DTO para actualizar un género
export interface UpdateGenreDTO {
    genre?: string;
}

// DTO para respuesta de géneros
export interface GenreResponseDTO {
    id: string;
    genre: string;
    createdAt: Date;
    updatedAt: Date;
}