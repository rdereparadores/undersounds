// import { ISong } from '../../models/interfaces/ISong';
//
// export interface ISongDAO {
//     findAll(): Promise<ISong[]>;
//     findById(id: string): Promise<ISong | null>;
//     findByIdWithDetails(id: string): Promise<ISong | null>;
//     findByPerformer(performerId: string): Promise<ISong[]>;
//     findByCollaborator(collaboratorId: string): Promise<ISong[]>;
//     findByGenrePaginated(genreId: string, skip: number, limit: number): Promise<ISong[]>;
//     countByGenre(genreId: string): Promise<number>;
//     create(songData: Partial<ISong>): Promise<ISong>;
//     update(id: string, songData: Partial<ISong>): Promise<ISong | null>;
//     delete(id: string): Promise<boolean>;
//     incrementPlays(id: string): Promise<ISong | null>;
//     findMostPlayed(limit: number): Promise<ISong[]>;
//     findRecommendations(songId: string, limit: number): Promise<ISong[]>;
// }