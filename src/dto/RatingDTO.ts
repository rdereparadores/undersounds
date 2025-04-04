/*import { UserResponseDTO } from './UserDTO';*/ // -- DESCOMENTAR CUANDO USERDTO ESTE IMPLEMENTADO
import { ProductResponseDTO } from './ProductDTO';

// DTO para crear una valoración
export interface CreateRatingDTO {
    rating: number;
    title: string;
    description: string;
    author: string; // ID del usuario
    product: string; // ID del producto
}

// DTO para actualizar una valoración
export interface UpdateRatingDTO {
    rating?: number;
    title?: string;
    description?: string;
}

// DTO para respuesta de valoraciones
export interface RatingResponseDTO {
    id: string;
    rating: number;
    title: string;
    description: string;
    publish_date: Date;
    /*author: UserResponseDTO;*/
    product: ProductResponseDTO;
    createdAt: Date;
    updatedAt: Date;
}

// DTO simplificado para respuestas anidadas
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

// DTO para promedio de valoraciones
export interface AverageRatingDTO {
    productId: string;
    averageRating: number;
    totalRatings: number;
}