import { AlbumDTO } from "../dto/AlbumDTO"
import { ArtistDTO } from "../dto/ArtistDTO"
import { SongDTO } from "../dto/SongDTO"
import { IProductDAO, ProductDAO } from "./ProductDAO"
import { Album } from "../models/Album"

export interface IAlbumDAO extends IProductDAO {
    create(album: AlbumDTO): Promise<AlbumDTO>
    
    findById(_id: string): Promise<AlbumDTO | null>
    findByTitle(title: string): Promise<AlbumDTO[]>
    findByArtist(artist: Partial<ArtistDTO>): Promise<AlbumDTO[]>
    findByReleaseDateRange(from: Date, to: Date): Promise<AlbumDTO[]>

    getAll(): Promise<AlbumDTO[]>

    update(album: Partial<AlbumDTO>): Promise<boolean>
    
    getTrackList(album: Partial<AlbumDTO>): Promise<SongDTO[]>
    addToTrackList(album: Partial<AlbumDTO>, track: SongDTO): Promise<boolean>
    removeFromTrackList(album: Partial<AlbumDTO>, track: SongDTO): Promise<boolean>

    getVersionHistory(album: Partial<AlbumDTO>): Promise<AlbumDTO[]>
    getVersionFromVersionHistory(album: Partial<AlbumDTO>, version: number): Promise<AlbumDTO | null>
    addToVersionHistory(album: Partial<AlbumDTO>, version: AlbumDTO): Promise<boolean>
}

export class AlbumDAO extends ProductDAO implements IAlbumDAO {
    constructor() {super()}

    async create(album: AlbumDTO): Promise<AlbumDTO> {
        const newAlbum = await Album.create(album)
        return AlbumDTO.fromDocument(newAlbum)
    }

    async findById(_id: string): Promise<AlbumDTO | null> {
        const album = await Album.findById(_id)
        if (album === null) return null

        return AlbumDTO.fromDocument(album)
    }

    async findByTitle(title: string): Promise<AlbumDTO[]> {
        const albums = await Album.find({ title })
        return albums.map(album => AlbumDTO.fromDocument(album))
    }

    async findByArtist(artist: Partial<ArtistDTO>): Promise<AlbumDTO[]> {
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

    async update(product: Partial<AlbumDTO>): Promise<boolean> {
        const updatedAlbum = await Album.findByIdAndUpdate(
            product._id,
            { ...product.toJson!() },
            { new: true }
        )

        return updatedAlbum !== null
    }

    async getTrackList(album: Partial<AlbumDTO>): Promise<SongDTO[]> {
        const albumDoc = await Album.findById(album._id).populate('trackList')
        if (albumDoc === null) return []

        return Array.isArray(albumDoc.trackList)
            ? albumDoc.trackList.map((track: any) => SongDTO.fromDocument(track))
            : []
    }

    async addToTrackList(album: Partial<AlbumDTO>, track: SongDTO): Promise<boolean> {
        const albumDoc = await Album.findByIdAndUpdate(album._id, {
            $push: { trackList: track._id }
        }, { new: true })

        return albumDoc !== null
    }

    async removeFromTrackList(album: Partial<AlbumDTO>, track: Partial<SongDTO>): Promise<boolean> {
        const albumDoc = await Album.findByIdAndUpdate(album._id, {
            $pull: { trackList: track._id }
        }, { new: true })

        return albumDoc !== null
    }

    async getVersionHistory(album: Partial<AlbumDTO>): Promise<AlbumDTO[]> {
        const albumDoc = await Album.findById(album._id).populate('versionHistory')
        if (albumDoc === null) return []

        return Array.isArray(albumDoc.versionHistory)
            ? albumDoc.versionHistory.map((version: any) => AlbumDTO.fromDocument(version))
            : []
    }

    async getVersionFromVersionHistory(album: Partial<AlbumDTO>, version: number): Promise<AlbumDTO | null> {
        const albumDoc = await Album.findById(album._id)
        if (albumDoc === null || albumDoc.versionHistory.length === 0) return null

        const versionDoc = await Album.find({
            _id: { $in: albumDoc.versionHistory },
            version: version
        })

        if (versionDoc === null) return null

        return AlbumDTO.fromDocument(versionDoc[0])
    }

    async addToVersionHistory(album: Partial<AlbumDTO>, version: AlbumDTO): Promise<boolean> {
        const albumDoc = await Album.findById(album._id)
        if (albumDoc === null) return false

        const albumGeneric = AlbumDTO.fromDocument(albumDoc)
        albumGeneric._id = undefined
        albumGeneric.versionHistory = []
        
        const newVersion = await Album.create({
            ...albumGeneric.toJson(),
            ...version.toJson(),
            version: albumDoc.versionHistory.length
        })

        await Album.findByIdAndUpdate(album._id, {
            $push: { versionHistory: newVersion._id }
        })

        return true
    }
}