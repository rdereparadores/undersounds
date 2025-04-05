// import { IAlbumDAO } from '../interfaces/IAlbumDAO';
// import { IAlbum } from '../../models/interfaces/IAlbum';
// import AlbumModel from '../../models/AlbumModel';
// import { ApiError } from '../../utils/ApiError';
//
// export class AlbumDAO implements IAlbumDAO {
//     async findById(id: string): Promise<IAlbum | null> {
//         try {
//             return await AlbumModel.findById(id);
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving album');
//         }
//     }
//
//     async findByIdWithDetails(id: string): Promise<IAlbum | null> {
//         try {
//             return await AlbumModel.findById(id)
//                 .populate({
//                     path: 'track_list',
//                     populate: [
//                         { path: 'performer' },
//                         { path: 'collaborators' },
//                         { path: 'genres' }
//                     ]
//                 })
//                 .populate('genres');
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving album with details');
//         }
//     }
//
//     async findByGenrePaginated(genreId: string, skip: number, limit: number): Promise<IAlbum[]> {
//         try {
//             return await AlbumModel.find({ genres: genreId })
//                 .skip(skip)
//                 .limit(limit);
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving albums by genre');
//         }
//     }
//
//     async countByGenre(genreId: string): Promise<number> {
//         try {
//             return await AlbumModel.countDocuments({ genres: genreId });
//         } catch (error) {
//             throw new ApiError(500, 'Error counting albums by genre');
//         }
//     }
//
//     async findRecommendations(albumId: string, limit: number): Promise<IAlbum[]> {
//         try {
//             const album = await AlbumModel.findById(albumId);
//             if (!album) {
//                 throw new ApiError(404, 'Album not found');
//             }
//
//             // Obtener recomendaciones basadas en géneros similares
//             return await AlbumModel.find({
//                 _id: { $ne: albumId },
//                 genres: { $in: album.genres }
//             })
//                 .limit(limit);
//         } catch (error) {
//             if (error instanceof ApiError) throw error;
//             throw new ApiError(500, 'Error finding album recommendations');
//         }
//     }
//
//     // Métodos no utilizados por los controladores actuales pero posibles posteriormente
//     async findAll(): Promise<IAlbum[]> {
//         try {
//             return await AlbumModel.find();
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving albums');
//         }
//     }
//
//     async create(albumData: Partial<IAlbum>): Promise<IAlbum> {
//         try {
//             const album = new AlbumModel(albumData);
//             return await album.save();
//         } catch (error) {
//             throw new ApiError(500, 'Error creating album');
//         }
//     }
//
//     async update(id: string, albumData: Partial<IAlbum>): Promise<IAlbum | null> {
//         try {
//             return await AlbumModel.findByIdAndUpdate(
//                 id,
//                 { $set: albumData },
//                 { new: true }
//             );
//         } catch (error) {
//             throw new ApiError(500, 'Error updating album');
//         }
//     }
//
//     async delete(id: string): Promise<boolean> {
//         try {
//             const result = await AlbumModel.findByIdAndDelete(id);
//             return result !== null;
//         } catch (error) {
//             throw new ApiError(500, 'Error deleting album');
//         }
//     }
//
//     async addTrack(albumId: string, songId: string): Promise<IAlbum | null> {
//         try {
//             return await AlbumModel.findByIdAndUpdate(
//                 albumId,
//                 { $addToSet: { track_list: songId } },
//                 { new: true }
//             );
//         } catch (error) {
//             throw new ApiError(500, 'Error adding track to album');
//         }
//     }
//
//     async removeTrack(albumId: string, songId: string): Promise<IAlbum | null> {
//         try {
//             return await AlbumModel.findByIdAndUpdate(
//                 albumId,
//                 { $pull: { track_list: songId } },
//                 { new: true }
//             );
//         } catch (error) {
//             throw new ApiError(500, 'Error removing track from album');
//         }
//     }
// }