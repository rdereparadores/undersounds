// import { ISongDAO } from '../interfaces/ISongDAO';
// import { ISong } from '../../models/interfaces/ISong';
// import SongModel from '../../models/SongModel';
// import { ApiError } from '../../utils/ApiError';
//
// export class SongDAO implements ISongDAO {
//     async findById(id: string): Promise<ISong | null> {
//         try {
//             return await SongModel.findById(id);
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving song');
//         }
//     }
//
//     async findByIdWithDetails(id: string): Promise<ISong | null> {
//         try {
//             return await SongModel.findById(id)
//                 .populate('performer')
//                 .populate('collaborators')
//                 .populate('genres');
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving song with details');
//         }
//     }
//
//     async findMostPlayed(limit: number): Promise<ISong[]> {
//         try {
//             return await SongModel.find()
//                 .sort({ plays: -1 })
//                 .limit(limit)
//                 .populate('performer')
//                 .populate('genres');
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving most played songs');
//         }
//     }
//
//     async findRecommendations(songId: string, limit: number): Promise<ISong[]> {
//         try {
//             const song = await SongModel.findById(songId);
//             if (!song) {
//                 throw new ApiError(404, 'Song not found');
//             }
//
//             // Obtener recomendaciones basadas en géneros y artistas similares
//             return await SongModel.find({
//                 _id: { $ne: songId },
//                 $or: [
//                     { genres: { $in: song.genres } },
//                     { performer: song.performer },
//                     { collaborators: { $in: song.collaborators } }
//                 ]
//             })
//                 .limit(limit)
//                 .populate('performer')
//                 .populate('genres');
//         } catch (error) {
//             if (error instanceof ApiError) throw error;
//             throw new ApiError(500, 'Error finding song recommendations');
//         }
//     }
//
//     async incrementPlays(id: string): Promise<ISong | null> {
//         try {
//             return await SongModel.findByIdAndUpdate(
//                 id,
//                 { $inc: { plays: 1 } },
//                 { new: true }
//             );
//         } catch (error) {
//             throw new ApiError(500, 'Error incrementing plays count');
//         }
//     }
//
//     async findByGenrePaginated(genreId: string, skip: number, limit: number): Promise<ISong[]> {
//         try {
//             return await SongModel.find({ genres: genreId })
//                 .skip(skip)
//                 .limit(limit)
//                 .populate('performer')
//                 .populate('genres');
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving songs by genre');
//         }
//     }
//
//     async countByGenre(genreId: string): Promise<number> {
//         try {
//             return await SongModel.countDocuments({ genres: genreId });
//         } catch (error) {
//             throw new ApiError(500, 'Error counting songs by genre');
//         }
//     }
//
//     // Métodos no utilizados por los controladores actuales pero posibles posteriormente
//     async findAll(): Promise<ISong[]> {
//         try {
//             return await SongModel.find()
//                 .populate('performer')
//                 .populate('collaborators')
//                 .populate('genres');
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving songs');
//         }
//     }
//
//     async findByPerformer(performerId: string): Promise<ISong[]> {
//         try {
//             return await SongModel.find({ performer: performerId })
//                 .populate('genres');
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving songs by performer');
//         }
//     }
//
//     async findByCollaborator(collaboratorId: string): Promise<ISong[]> {
//         try {
//             return await SongModel.find({ collaborators: collaboratorId })
//                 .populate('performer')
//                 .populate('genres');
//         } catch (error) {
//             throw new ApiError(500, 'Error retrieving songs by collaborator');
//         }
//     }
//
//     async create(songData: Partial<ISong>): Promise<ISong> {
//         try {
//             const song = new SongModel(songData);
//             return await song.save();
//         } catch (error) {
//             throw new ApiError(500, 'Error creating song');
//         }
//     }
//
//     async update(id: string, songData: Partial<ISong>): Promise<ISong | null> {
//         try {
//             return await SongModel.findByIdAndUpdate(
//                 id,
//                 { $set: songData },
//                 { new: true }
//             );
//         } catch (error) {
//             throw new ApiError(500, 'Error updating song');
//         }
//     }
//
//     async delete(id: string): Promise<boolean> {
//         try {
//             const result = await SongModel.findByIdAndDelete(id);
//             return result !== null;
//         } catch (error) {
//             throw new ApiError(500, 'Error deleting song');
//         }
//     }
// }