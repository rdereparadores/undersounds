import { AlbumDTO } from "../dto/AlbumDTO";
import { ArtistDTO } from "../dto/ArtistDTO";
import { RatingDTO } from "../dto/RatingDTO";
import { SongDTO } from "../dto/SongDTO";
import { IProductDAO } from "./ProductDAO";

export interface IAlbumDAO extends IProductDAO {
    findById(_id: string): Promise<AlbumDTO | null>
    findByTitle(title: string): Promise<AlbumDTO[] | null>
    findByArtist(artist: ArtistDTO): Promise<AlbumDTO[] | null>
    findByReleaseDateRange(from: Date, to: Date): Promise<AlbumDTO[]>

    getAll(): Promise<AlbumDTO[]>

    update(product: AlbumDTO): Promise<AlbumDTO | null>
    
    getTrackList(dto: AlbumDTO): Promise<SongDTO[] | null>
    addToTrackList(dto: AlbumDTO, track: SongDTO): Promise<AlbumDTO | null>
    removeFromTrackList(dto: AlbumDTO, track: SongDTO): Promise<AlbumDTO | null>

    getVersionHistory(dto: AlbumDTO): Promise<AlbumDTO[] | null>
    getVersionFromVersionHistory(album: AlbumDTO, version: number): Promise<AlbumDTO | null>
    addToVersionHistory(album: AlbumDTO, version: AlbumDTO): Promise<AlbumDTO | null>
}