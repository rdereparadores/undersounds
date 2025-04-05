import { ProductDTO, ProductDTOProps } from './ProductDTO';
import { UserDTOProps } from './UserDTO';
// import { UserDTO } from './UserDTO';

export interface RatingDTOProps {
    _id: string;
    rating: number;
    title: string;
    description: string;
    publish_date: Date;
    author: UserDTOProps;
    product: ProductDTOProps;
}

export class RatingDTO implements RatingDTOProps {
    _id!: string;
    rating!: number;
    title!: string;
    description!: string;
    publish_date!: Date;
    author!: UserDTOProps;
    product!: ProductDTOProps;

    constructor(props: RatingDTOProps) {
        Object.assign(this, props)
    }

    toJson() {
        return {
            ...this
        }
    }
}