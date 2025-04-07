import { AlbumDTO } from "../dto/AlbumDTO";
import { ArtistDTO } from "../dto/ArtistDTO";
import { RatingDTO } from "../dto/RatingDTO";
import { SongDTO } from "../dto/SongDTO";
import {IProductDAO, ProductDAO} from "./ProductDAO";
import {Album} from "../models/Album";
import {Song} from "../models/Song";

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

export class AlbumDAO extends ProductDAO implements IAlbumDAO {
    constructor() {super()}

    async findById(_id: string): Promise<AlbumDTO | null> {
        const album = await Album.findById(_id)
        if (!album) return null

        return AlbumDTO.fromDocument(album)
    }

    async findByTitle(title: string): Promise<AlbumDTO[] | null> {
        const albums = await Album.find({ title })
        return albums.map(album => AlbumDTO.fromDocument(album))
    }

    async findByArtist(artist: ArtistDTO): Promise<AlbumDTO[] | null> {
        const albums = await Album.find({ author: artist._id })
        return albums.map(album => AlbumDTO.fromDocument(album))
    }

    async findByReleaseDateRange(from: Date, to: Date): Promise<AlbumDTO[]> {
        const albums = await Album.find({
            release_date: {
                $gte: from,
                $lte: to
            }
        })
        return albums.map(album => AlbumDTO.fromDocument(album))
    }

    async getAll(): Promise<AlbumDTO[]> {
        const albums = await Album.find()
        return albums.map(album => AlbumDTO.fromDocument(album))
    }

    async update(product: AlbumDTO): Promise<AlbumDTO | null> {
        const updatedAlbum = await Album.findByIdAndUpdate(
            product._id,
            { ...product.toJson() },
            { new: true }
        )

        if (!updatedAlbum) return null

        return AlbumDTO.fromDocument(updatedAlbum)
    }

    async getTrackList(dto: AlbumDTO): Promise<SongDTO[] | null> {
        const albumDoc = await Album.findById(dto._id).populate('track_list')
        if (!albumDoc) return null

        return Array.isArray(albumDoc.track_list)
            ? albumDoc.track_list.map((track: any) => SongDTO.fromDocument(track))
            : null;
    }

    async addToTrackList(dto: AlbumDTO, track: SongDTO): Promise<AlbumDTO | null> {
        const albumDoc = await Album.findByIdAndUpdate(dto._id, {
            $push: { track_list: track._id }
        }, { new: true })

        if (!albumDoc) return null
        return AlbumDTO.fromDocument(albumDoc)
    }

    async removeFromTrackList(dto: AlbumDTO, track: SongDTO): Promise<AlbumDTO | null> {
        const albumDoc = await Album.findByIdAndUpdate(dto._id, {
            $pull: { track_list: track._id }
        }, { new: true })

        if (!albumDoc) return null
        return AlbumDTO.fromDocument(albumDoc)
    }

    async getVersionHistory(dto: AlbumDTO): Promise<AlbumDTO[] | null> {
        const albumDoc = await Album.findById(dto._id).populate('version_history')
        if (!albumDoc) return null

        return Array.isArray(albumDoc.version_history)
            ? albumDoc.version_history.map((version: any) => AlbumDTO.fromDocument(version))
            : null;
    }

    async getVersionFromVersionHistory(album: AlbumDTO, version: number): Promise<AlbumDTO | null> {
        const albumDoc = await Album.findById(album._id)
        if (!albumDoc || !albumDoc.version_history.length) return null

        const versionDocs = await Album.find({
            _id: { $in: albumDoc.version_history },
            version: version
        })

        if (!versionDocs.length) return null

        return AlbumDTO.fromDocument(versionDocs[0])
    }

    async addToVersionHistory(album: AlbumDTO, version: AlbumDTO): Promise<AlbumDTO | null> {
        let albumDoc = await Album.findById(album._id)
        if (!albumDoc) return null
        const newVersion = await Album.create({
            ...version.toJson(),
            version: albumDoc.version_history.length
        })

        albumDoc = await Album.findByIdAndUpdate(album._id, {
            $push: { version_history: newVersion._id }
        })

        if (!albumDoc) return null
        return AlbumDTO.fromDocument(albumDoc)
    }
}