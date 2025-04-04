/*import { IAlbum } from "../../models/interfaces/IAlbum";

export interface IAlbumDAO {
    findAll(): Promise<IAlbum[]>;
    findById(id: string): Promise<IAlbum | null>;
    findByTitle(title: string): Promise<IAlbum[]>;
    findByGenre(genreId: string): Promise<IAlbum[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<IAlbum[]>;
    create(albumData: Partial<IAlbum>): Promise<IAlbum>;
    update(id: string, albumData: Partial<IAlbum>): Promise<IAlbum | null>;
    delete(id: string): Promise<boolean>;

    // Métodos específicos para álbumes
    addSongToAlbum(albumId: string, songId: string): Promise<IAlbum | null>;
    removeSongFromAlbum(albumId: string, songId: string): Promise<IAlbum | null>;
    addGenreToAlbum(albumId: string, genreId: string): Promise<IAlbum | null>;
    removeGenreFromAlbum(albumId: string, genreId: string): Promise<IAlbum | null>;
}

 */

// DESCOMENTAR CUANDO LA CARPETA MODELO ESTE IMPORTADA