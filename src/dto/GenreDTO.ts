export interface GenreResponseDTO {
    id: string;
    genre: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateGenreDTO {
    genre: string;
}

export interface UpdateGenreDTO {
    genre: string;
}