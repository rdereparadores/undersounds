import { ProductDTO } from './ProductDTO';
// import { UserDTO } from './UserDTO';

export interface RatingDTO {
    id: string;
    rating: number;
    title: string;
    description: string;
    publish_date: Date;
//    author: UserDTO;
    product: ProductDTO;
    createdAt: Date;
    updatedAt: Date;
}