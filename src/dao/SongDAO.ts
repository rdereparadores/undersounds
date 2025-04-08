import { ArtistDTO } from "../dto/ArtistDTO";
import { GenreDTO } from "../dto/GenreDTO";
import { RatingDTO } from "../dto/RatingDTO";
import { SongDTO } from "../dto/SongDTO";
import { Rating } from "../models/Rating";
import { Song } from "../models/Song";
import { IProductDAO, ProductDAO } from "./ProductDAO";

export interface ISongDAO extends IProductDAO {
    findById(_id: string): Promise<SongDTO | null>
    findByTitle(title: string): Promise<SongDTO[] | null>
    findByArtist(artist: ArtistDTO): Promise<SongDTO[] | null>
    findByReleaseDateRange(from: Date, to: Date): Promise<SongDTO[]>
    findByTopViews(limit: number): Promise<SongDTO[]>
    findByGenre(genre: GenreDTO): Promise<SongDTO[]>
    findRecommendations(id: string, limit: number): Promise<SongDTO[]>

    getAll(): Promise<SongDTO[]>

    update(song: SongDTO): Promise<SongDTO | null>

    getVersionHistory(song: SongDTO): Promise<SongDTO[] | null>
    addToVersionHistory(song: SongDTO, version: SongDTO): Promise<SongDTO | null>
}

export class SongDAO extends ProductDAO implements ISongDAO {
    constructor() {super()}

    async findById(_id: string): Promise<SongDTO | null> {
        const song = await Song.findById(_id)
        if (!song) return null

        return SongDTO.fromDocument(song)
    }

    async findByTitle(title: string): Promise<SongDTO[] | null> {
        const songs = await Song.find({ title })
        return songs.map(song => SongDTO.fromDocument(song))
    }

    async findByArtist(artist: ArtistDTO): Promise<SongDTO[] | null> {
        const songs = await Song.find({ author: artist._id })
        return songs.map(song => SongDTO.fromDocument(song))
    }

    async findByReleaseDateRange(from: Date, to: Date): Promise<SongDTO[]> {
        const songs = await Song.find({
            release_date: {
                $gte: from,
                $lte: to
            }
        })
        return songs.map(song => SongDTO.fromDocument(song))
    }

    async findByTopViews(limit: number): Promise<SongDTO[]> {
        const songs = await Song.find().sort({ plays: -1 }).limit(limit)
        if (!songs) return []

        return songs.map(song => SongDTO.fromDocument(song))
    }

    async findByGenre(genre: GenreDTO): Promise<SongDTO[]> {
        const songs = await Song.find({
            genres: genre._id
        })

        if (!songs) return []

        return songs.map(song => SongDTO.fromDocument(song))
    }

    async findRecommendations(id: string, limit: number): Promise<SongDTO[]> {
        const originalSong = await Song.findById(id);
        if (!originalSong || !originalSong.genres || originalSong.genres.length === 0) {
            return [];
        }

        const recommendations = await Song.aggregate([
            {
                $match: {
                    _id: { $ne: originalSong._id },
                    genres: { $in: originalSong.genres }
                }
            },
            { $sample: { size: limit } }
        ]);

        if (recommendations.length < limit) {
            const remainingCount = limit - recommendations.length;
            const existingIds = recommendations.map(song => song._id);
            existingIds.push(originalSong._id);

            const popularSongs = await Song.find({
                _id: { $nin: existingIds }
            }).sort({ plays: -1 }).limit(remainingCount);

            recommendations.push(...popularSongs);
        }

        return recommendations.map(song => SongDTO.fromDocument(song));
    }

    async getAll(): Promise<SongDTO[]> {
        const songs = await Song.find()
        return songs.map(song => SongDTO.fromDocument(song))
    }

    async update(song: SongDTO): Promise<SongDTO | null> {
        const updatedSong = await Song.findByIdAndUpdate(
            song._id,
            { ...song.toJson() },
            { new: true }
        )

        if (!updatedSong) return null

        return SongDTO.fromDocument(updatedSong)
    }

    async getVersionHistory(song: SongDTO): Promise<SongDTO[] | null> {
        const songDoc = await Song.findById(song._id).populate('version_history')
        if (!songDoc) return null

        return Array.isArray(songDoc.version_history)
            ? songDoc.version_history.map((version: any) => SongDTO.fromDocument(version))
            : null;
    }

    async addToVersionHistory(song: SongDTO, version: SongDTO): Promise<SongDTO | null> {
        let songDoc = await Song.findById(song._id)
        if (!songDoc) return null
        const newVersion = await Song.create({
            ...version.toJson(),
            version: songDoc.version_history.length
        })

        songDoc = await Song.findByIdAndUpdate(song._id, {
            $push: { version_history: newVersion._id }
        })

        if (!songDoc) return null
        return SongDTO.fromDocument(songDoc)
    }
}