// import { IProduct } from '../../models/interfaces/IProduct';
//
// export interface IProductDAO {
//     findAll(): Promise<IProduct[]>;
//     findById(id: string): Promise<IProduct | null>;
//     findByTitle(title: string): Promise<IProduct[]>;
//     findByReleaseDate(startDate: Date, endDate: Date): Promise<IProduct[]>;
//     create(productData: Partial<IProduct>): Promise<IProduct>;
//     update(id: string, productData: Partial<IProduct>): Promise<IProduct | null>;
//     delete(id: string): Promise<boolean>;
//     findByGenrePaginated(genreId: string, skip: number, limit: number): Promise<IProduct[]>;
//     countByGenre(genreId: string): Promise<number>;
//     findByFilterWithPagination(filter: any, sort: any, skip: number, limit: number): Promise<IProduct[]>;
//     countByFilter(filter: any): Promise<number>;
//     findLatestReleases(limit: number): Promise<IProduct[]>;
// }