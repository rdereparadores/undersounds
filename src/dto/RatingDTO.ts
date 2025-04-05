import { ProductResponseDTO } from './ProductDTO';

// DTO para usuario básico (para mostrar autor de valoraciones)
export interface UserBasicDTO {
    id: string;
    name: string;
    sur_name: string;
    img_url?: string;
}

// Respuesta completa para valoración
export interface RatingResponseDTO {
    id: string;
    rating: number;
    title: string;
    description: string;
    publish_date: Date;
    author: UserBasicDTO;
    product: ProductResponseDTO;
    createdAt: Date;
    updatedAt: Date;
}

// Versión simplificada para listas
export interface SimpleRatingResponseDTO {
    id: string;
    rating: number;
    title: string;
    author: {
        id: string;
        name: string;
        sur_name: string;
    };
}

export interface CreateRatingDTO {
    rating: number;
    title: string;
    description: string;
    author: string; // ID del usuario
    product: string; // ID del producto
}

export interface UpdateRatingDTO {
    rating?: number;
    title?: string;
    description?: string;
}