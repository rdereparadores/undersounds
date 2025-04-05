export interface PricingDTO {
    cd: number;
    digital: number;
    cassette: number;
    vinyl: number;
}

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

export interface CreateProductDTO {
    title: string;
    release_date: Date;
    description: string;
    img_url: string;
    duration: number;
    pricing: PricingDTO;
}

export interface UpdateProductDTO {
    title?: string;
    release_date?: Date;
    description?: string;
    img_url?: string;
    duration?: number;
    pricing?: Partial<PricingDTO>;
}