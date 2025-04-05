// import { IGenreDAO } from '../interfaces/IGenreDAO';
// import { IGenre } from '../../models/interfaces/IGenre';
// import GenreModel from '../../models/GenreModel';
// import { ApiError } from '../../utils/ApiError';
//
// export class GenreDAO implements IGenreDAO {
//     async findAll(): Promise<IGenre[]> {
//         try {
//             return await GenreModel.find().sort({ genre: 1 });
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving genres');
//         }
//     }
//
//     async findById(id: string): Promise<IGenre | null> {
//         try {
//             return await GenreModel.findById(id);
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving genre');
//         }
//     }
//
//     async findByName(genre: string): Promise<IGenre | null> {
//         try {
//             return await GenreModel.findOne({ genre: { $regex: new RegExp(`^${genre}$`, 'i') } });
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving genre by name');
//         }
//     }
//
//     // Métodos no utilizados por los controladores actuales pero posibles posteriormentes
//     async create(genreData: Partial<IGenre>): Promise<IGenre> {
//         try {
//             const genre = new GenreModel(genreData);
//             return await genre.save();
//         } catch (error) {
//             if (error.code === 11000) { // Duplicate key error
//                 throw new ApiError(409, 'Genre already exists');
//             }
//             throw new ApiError(500, 'Error creating genre');
//         }
//     }
//
//     async update(id: string, genreData: Partial<IGenre>): Promise<IGenre | null> {
//         try {
//             return await GenreModel.findByIdAndUpdate(
//                 id,
//                 { $set: genreData },
//                 { new: true }
//             );
//         } catch (error) {
//             if (error.code === 11000) { // Duplicate key error
//                 throw new ApiError(409, 'Genre name already exists');
//             }
//             throw new ApiError(500, 'Error updating genre');
//         }
//     }
//
//     async delete(id: string): Promise<boolean> {
//         try {
//             const result = await GenreModel.findByIdAndDelete(id);
//             return result !== null;
//         } catch (error) {
//             throw new ApiError(500, 'Error deleting genre');
//         }
//     }
// }