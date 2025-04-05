// import { IAlbum } from '../../models/interfaces/IAlbum';
//
// export interface IAlbumDAO {
//     findAll(): Promise<IAlbum[]>;
//     findById(id: string): Promise<IAlbum | null>;
//     findByIdWithDetails(id: string): Promise<IAlbum | null>;
//     findByGenrePaginated(genreId: string, skip: number, limit: number): Promise<IAlbum[]>;
//     countByGenre(genreId: string): Promise<number>;
//     create(albumData: Partial<IAlbum>): Promise<IAlbum>;
//     update(id: string, albumData: Partial<IAlbum>): Promise<IAlbum | null>;
//     delete(id: string): Promise<boolean>;
//     addTrack(albumId: string, songId: string): Promise<IAlbum | null>;
//     removeTrack(albumId: string, songId: string): Promise<IAlbum | null>;
//     findRecommendations(albumId: string, limit: number): Promise<IAlbum[]>;
// }