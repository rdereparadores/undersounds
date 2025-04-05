// import { IProductDAO } from '../interfaces/IProductDAO';
// import { IProduct } from '../../models/interfaces/IProduct';
// import ProductModel from '../../models/ProductModel';
// import { ApiError } from '../../utils/ApiError';
//
// export class ProductDAO implements IProductDAO {
//     async findById(id: string): Promise<IProduct | null> {
//         try {
//             return await ProductModel.findById(id);
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving product');
//         }
//     }
//
//     async findByFilterWithPagination(filter: any, sort: any, skip: number, limit: number): Promise<IProduct[]> {
//         try {
//             return await ProductModel.find(filter)
//                 .sort(sort)
//                 .skip(skip)
//                 .limit(limit);
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving products');
//         }
//     }
//
//     async countByFilter(filter: any): Promise<number> {
//         try {
//             return await ProductModel.countDocuments(filter);
//         } catch (error) {
//             throw new ApiError(500, 'Error counting products');
//         }
//     }
//
//     async findByGenrePaginated(genreId: string, skip: number, limit: number): Promise<IProduct[]> {
//         try {
//             return await ProductModel.find({ genres: genreId })
//                 .skip(skip)
//                 .limit(limit);
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving products by genre');
//         }
//     }
//
//     async countByGenre(genreId: string): Promise<number> {
//         try {
//             return await ProductModel.countDocuments({ genres: genreId });
//         } catch (error) {
//             throw new ApiError(500, 'Error counting products by genre');
//         }
//     }
//
//     async update(id: string, productData: Partial<IProduct>): Promise<IProduct | null> {
//         try {
//             return await ProductModel.findByIdAndUpdate(
//                 id,
//                 { $set: productData },
//                 { new: true }
//             );
//         } catch (error) {
//             throw new ApiError(500, 'Error updating product');
//         }
//     }
//
//     // Métodos no utilizados por los controladores actuales pero posibles posteriormente
//     async findAll(): Promise<IProduct[]> {
//         try {
//             return await ProductModel.find();
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving products');
//         }
//     }
//
//     async findByTitle(title: string): Promise<IProduct[]> {
//         try {
//             return await ProductModel.find({ title: { $regex: title, $options: 'i' } });
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving products by title');
//         }
//     }
//
//     async findByReleaseDate(startDate: Date, endDate: Date): Promise<IProduct[]> {
//         try {
//             return await ProductModel.find({
//                 release_date: { $gte: startDate, $lte: endDate }
//             });
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving products by release date');
//         }
//     }
//
//     async create(productData: Partial<IProduct>): Promise<IProduct> {
//         try {
//             const product = new ProductModel(productData);
//             return await product.save();
//         } catch (error) {
//             throw new ApiError(500, 'Error creating product');
//         }
//     }
//
//     async delete(id: string): Promise<boolean> {
//         try {
//             const result = await ProductModel.findByIdAndDelete(id);
//             return result !== null;
//         } catch (error) {
//             throw new ApiError(500, 'Error deleting product');
//         }
//     }
//
//     async findLatestReleases(limit: number): Promise<IProduct[]> {
//         try {
//             return await ProductModel.find()
//                 .sort({ release_date: -1 })
//                 .limit(limit);
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving latest releases');
//         }
//     }
// }