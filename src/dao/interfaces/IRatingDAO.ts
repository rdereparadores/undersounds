// import { IRating } from '../../models/interfaces/IRating';
//
// export interface IRatingDAO {
//     findAll(): Promise<IRating[]>;
//     findById(id: string): Promise<IRating | null>;
//     findByProduct(productId: string): Promise<IRating[]>;
//     findByAuthor(authorId: string): Promise<IRating[]>;
//     findByProductAndAuthor(productId: string, authorId: string): Promise<IRating | null>;
//     create(ratingData: Partial<IRating>): Promise<IRating>;
//     update(id: string, ratingData: Partial<IRating>): Promise<IRating | null>;
//     delete(id: string): Promise<boolean>;
//     getAverageRatingForProduct(productId: string): Promise<number>;
// }