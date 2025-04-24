import { ArtistDTO } from "../dto/ArtistDTO"
import { GenreDTO } from "../dto/GenreDTO"
import { SongDTO } from "../dto/SongDTO"
import { Song } from "../models/Song"
import { IProductDAO, ProductDAO } from "./ProductDAO"

export interface ISongDAO extends IProductDAO {
    create(song: SongDTO): Promise<SongDTO>

    findById(_id: string): Promise<SongDTO | null>
    findByTitle(title: string): Promise<SongDTO[]>
    findByArtist(artist: Partial<ArtistDTO>): Promise<SongDTO[]>
    findByReleaseDateRange(from: Date, to: Date): Promise<SongDTO[]>
    findByTopViews(limit: number): Promise<SongDTO[]>
    findByGenre(genre: Partial<GenreDTO>): Promise<SongDTO[]>
    findRecommendations(song: Partial<SongDTO>, limit: number): Promise<SongDTO[]>
    findMostPlayed(limit: number): Promise<SongDTO[]>

    getAll(): Promise<SongDTO[]>

    update(song: Partial<SongDTO>): Promise<boolean>

    getVersionHistory(song: Partial<SongDTO>): Promise<SongDTO[]>
    getVersionFromVersionHistory(song: Partial<SongDTO>, version: number): Promise<SongDTO | null>
    addToVersionHistory(song: Partial<SongDTO>, version: SongDTO): Promise<boolean>
}

export class SongDAO extends ProductDAO implements ISongDAO {
    constructor() { super() }

    async create(song: SongDTO): Promise<SongDTO> {
        const newSong = await Song.create(song)
        return SongDTO.fromDocument(newSong)
    }

    async findById(_id: string): Promise<SongDTO | null> {
        const song = await Song.findById(_id)
        if (song === null) return null

        return SongDTO.fromDocument(song)
    }

    async findByTitle(title: string): Promise<SongDTO[]> {
        const songs = await Song.find({ title })
        if (songs === null) return []

        return songs.map(song => SongDTO.fromDocument(song))
    }

    async findByArtist(artist: Partial<ArtistDTO>): Promise<SongDTO[]> {
        const songs = await Song.find({ author: artist._id })
        if (songs === null) return []

        return songs.map(song => SongDTO.fromDocument(song)).filter(song => song.version === undefined)
    }

    async findByReleaseDateRange(from: Date, to: Date): Promise<SongDTO[]> {
        const songs = await Song.find({
            release_date: {
                $gte: from,
                $lte: to
            }
        })
        if (songs === null) return []

        return songs.map(song => SongDTO.fromDocument(song))
    }

    async findByTopViews(limit: number): Promise<SongDTO[]> {
        const songs = await Song.find().sort({ plays: -1 }).limit(limit)
        if (songs === null) return []

        return songs.map(song => SongDTO.fromDocument(song))
    }

    async findByGenre(genre: Partial<GenreDTO>): Promise<SongDTO[]> {
        const songs = await Song.find({
            genres: genre._id
        })
        if (songs === null) return []

        return songs.map(song => SongDTO.fromDocument(song))
    }

    async findRecommendations(song: Partial<SongDTO>, limit: number): Promise<SongDTO[]> {
        const songDoc = await Song.findById(song._id)
        if (songDoc === null) return []

        const recommendations = await Song.aggregate([
            {
                $match: {
                    _id: { $ne: songDoc._id },
                    genres: { $in: songDoc.genres }
                }
            },
            { $sample: { size: limit } }
        ])

        return recommendations.map(song => SongDTO.fromDocument(song))
    }

    async findMostPlayed(limit: number): Promise<SongDTO[]> {
        const songs = await Song.find()
            .sort({ plays: -1 })
            .limit(limit)
        if (songs === null) return []

        return songs.map(song => SongDTO.fromDocument(song))
    }

    async getAll(): Promise<SongDTO[]> {
        const songs = await Song.find()
        if (songs === null) return []

        return songs.map(song => SongDTO.fromDocument(song))
    }

    async update(song: Partial<SongDTO>): Promise<boolean> {
        const updatedSong = await Song.findByIdAndUpdate(
            song._id!,
            { ...song.toJson!() },
            { new: true }
        )

        return updatedSong !== null
    }

    async getVersionHistory(song: Partial<SongDTO>): Promise<SongDTO[]> {
        const songDoc = await Song.findById(song._id).populate('versionHistory')
        if (songDoc === null) return []

        return Array.isArray(songDoc.versionHistory)
            ? songDoc.versionHistory.map((version: any) => SongDTO.fromDocument(version))
            : []
    }

    async getVersionFromVersionHistory(song: Partial<SongDTO>, version: number): Promise<SongDTO | null> {
    
        const songDoc = await Song.findById(song._id);
        if (!songDoc) {
            return null;
        }
    
        if (!songDoc.versionHistory || songDoc.versionHistory.length === 0) {
            return null;
        }
    
        const versionDoc = await Song.findOne({
            _id: { $in: songDoc.versionHistory },
            version: version
        });
    
        if (!versionDoc) {
            return null;
        }
    
        return SongDTO.fromDocument(versionDoc);
    }

    async addToVersionHistory(songNueva: Partial<SongDTO>, songVieja: SongDTO): Promise<boolean> {
    const songViejaDoc = await Song.findById(songVieja._id);
    if (!songViejaDoc) {
       // console.error("No se encontró la canción vieja");
        return false;
    }

    songViejaDoc.versionHistory = [];
    await songViejaDoc.save();

    const songNuevaDoc = await Song.findById(songNueva._id);
    if (!songNuevaDoc) {
        //console.error("No se encontró la canción nueva");
        return false;
    }

    songNuevaDoc.versionHistory.push(songViejaDoc.id);

    songViejaDoc.version = songNuevaDoc.versionHistory.length - 1

    await songViejaDoc.save();
    await songNuevaDoc.save();

    return true;
    }
}