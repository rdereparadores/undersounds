// import { IRatingDAO } from '../interfaces/IRatingDAO';
// import { IRating } from '../../models/interfaces/IRating';
// import RatingModel from '../../models/RatingModel';
// import { ApiError } from '../../utils/ApiError';
//
// export class RatingDAO implements IRatingDAO {
//     async findById(id: string): Promise<IRating | null> {
//         try {
//             return await RatingModel.findById(id)
//                 .populate('author')
//                 .populate('product');
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving rating');
//         }
//     }
//
//     async findByProduct(productId: string): Promise<IRating[]> {
//         try {
//             return await RatingModel.find({ product: productId })
//                 .populate('author')
//                 .sort({ publish_date: -1 });
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving ratings by product');
//         }
//     }
//
//     async findByProductAndAuthor(productId: string, authorId: string): Promise<IRating | null> {
//         try {
//             return await RatingModel.findOne({
//                 product: productId,
//                 author: authorId
//             });
//         } catch (error) {
//             throw new ApiError(500, 'Error checking if user has already rated this product');
//         }
//     }
//
//     async create(ratingData: Partial<IRating>): Promise<IRating> {
//         try {
//             const rating = new RatingModel(ratingData);
//             return await rating.save();
//         } catch (error) {
//             if (error.code === 11000) { // Duplicate key error
//                 throw new ApiError(409, 'User has already rated this product');
//             }
//             throw new ApiError(500, 'Error creating rating');
//         }
//     }
//
//     async update(id: string, ratingData: Partial<IRating>): Promise<IRating | null> {
//         try {
//             return await RatingModel.findByIdAndUpdate(
//                 id,
//                 { $set: ratingData },
//                 { new: true }
//             )
//                 .populate('author')
//                 .populate('product');
//         } catch (error) {
//             throw new ApiError(500, 'Error updating rating');
//         }
//     }
//
//     async delete(id: string): Promise<boolean> {
//         try {
//             const result = await RatingModel.findByIdAndDelete(id);
//             return result !== null;
//         } catch (error) {
//             throw new ApiError(500, 'Error deleting rating');
//         }
//     }
//
//     async getAverageRatingForProduct(productId: string): Promise<number> {
//         try {
//             const result = await RatingModel.aggregate([
//                 { $match: { product: productId } },
//                 { $group: { _id: null, average: { $avg: '$rating' } } }
//             ]);
//
//             return result.length > 0 ? result[0].average : 0;
//         } catch (error) {
//             throw new ApiError(500, 'Error calculating average rating for product');
//         }
//     }
//
//     // Métodos no utilizados por los controladores actuales pero posibles posteriormente
//     async findAll(): Promise<IRating[]> {
//         try {
//             return await RatingModel.find()
//                 .populate('author')
//                 .populate('product')
//                 .sort({ publish_date: -1 });
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving ratings');
//         }
//     }
//
//     async findByAuthor(authorId: string): Promise<IRating[]> {
//         try {
//             return await RatingModel.find({ author: authorId })
//                 .populate('product')
//                 .sort({ publish_date: -1 });
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving ratings by author');
//         }
//     }
// }