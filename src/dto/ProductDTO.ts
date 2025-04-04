// DTOs para Product

export interface PricingDTO {
    cd: number;
    digital: number;
    cassette: number;
    vinyl: number;
}

// DTO para crear un producto
export interface CreateProductDTO {
    title: string;
    release_date: Date | string;
    description: string;
    img_url: string;
    duration: number;
    pricing: PricingDTO;
}

// DTO para actualizar un producto
export interface UpdateProductDTO {
    title?: string;
    release_date?: Date | string;
    description?: string;
    img_url?: string;
    duration?: number;
    pricing?: Partial<PricingDTO>;
}

// DTO para respuesta de productos
export interface ProductResponseDTO {
    id: string;
    title: string;
    release_date: Date;
    description: string;
    img_url: string;
    duration: number;
    pricing: PricingDTO;
    product_type: string;
    createdAt: Date;
    updatedAt: Date;
}