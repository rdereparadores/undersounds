/* import { ISong } from "../../models/interfaces/ISong";

export interface ISongDAO {
    findAll(): Promise<ISong[]>;
    findById(id: string): Promise<ISong | null>;
    findByTitle(title: string): Promise<ISong[]>;
    findByPerformer(performerId: string): Promise<ISong[]>;
    findByCollaborator(collaboratorId: string): Promise<ISong[]>;
    findByGenre(genreId: string): Promise<ISong[]>;
    findMostPlayed(limit?: number): Promise<ISong[]>;
    create(songData: Partial<ISong>): Promise<ISong>;
    update(id: string, songData: Partial<ISong>): Promise<ISong | null>;
    delete(id: string): Promise<boolean>;

    // Métodos específicos para canciones
    incrementPlays(id: string): Promise<ISong | null>;
    addCollaborator(songId: string, artistId: string): Promise<ISong | null>;
    removeCollaborator(songId: string, artistId: string): Promise<ISong | null>;
    addGenre(songId: string, genreId: string): Promise<ISong | null>;
    removeGenre(songId: string, genreId: string): Promise<ISong | null>;
}

 */

// DESCOMENTAR CUANDO LA CARPETA MODELO ESTE IMPORTADA