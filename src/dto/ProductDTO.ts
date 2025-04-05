export interface ProductDTO {
    id: string;
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
    product_type: string;
    createdAt: Date;
    updatedAt: Date;
}