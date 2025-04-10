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
    findCollaborators(songId: string): Promise<{ artist: string, accepted: boolean }[] | null>
    findMostPlayed(limit: number): Promise<SongDTO[]>
    findRecommendations(songId: string, limit: number): Promise<SongDTO[]>
    findByCollaborator(artistId: string): Promise<SongDTO[]>
    findAllByArtistParticipation(artistId: string): Promise<SongDTO[]>

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

    async findCollaborators(songId: string): Promise<{ artist: string, accepted: boolean }[] | null> {
        try {
            const song = await Song.findById(songId).populate('collaborators.artist');
            if (!song) return null;

            if (!song.collaborators || song.collaborators.length === 0) {
                return [];
            }

            return song.collaborators.map(collab => ({
                artist: collab.artist.toString(),
                accepted: collab.accepted
            }));
        } catch (error) {
            console.error('Error al obtener colaboradores:', error);
            return null;
        }
    }

    async findByCollaborator(artistId: string): Promise<SongDTO[]> {
        try {
            const songs = await Song.find({
                'collaborators.artist': artistId,
                'collaborators.accepted': true
            });

            return songs.map(song => SongDTO.fromDocument(song));
        } catch (error) {
            console.error('Error al buscar colaboraciones:', error);
            return [];
        }
    }

    async findAllByArtistParticipation(artistId: string): Promise<SongDTO[]> {
        try {
            const authoredSongs = await Song.find({ author: artistId });

            const collaborationSongs = await Song.find({
                'collaborators.artist': artistId,
                'collaborators.accepted': true
            });

            const allSongs = [...authoredSongs, ...collaborationSongs];
            const uniqueSongIds = new Set();
            const uniqueSongs = [];

            for (const song of allSongs) {
                if (!uniqueSongIds.has(song._id.toString())) {
                    uniqueSongIds.add(song._id.toString());
                    uniqueSongs.push(song);
                }
            }

            return uniqueSongs.map(song => SongDTO.fromDocument(song));
        } catch (error) {
            console.error('Error al buscar canciones por participación:', error);
            return [];
        }
    }

    async findMostPlayed(limit: number): Promise<SongDTO[]> {
        try {
            const songs = await Song.find()
                .sort({ plays: -1 })
                .limit(limit)
                .populate('author');

            return songs.map(song => SongDTO.fromDocument(song));
        } catch (error) {
            console.error('Error al obtener canciones más reproducidas:', error);
            return [];
        }
    }

    async findRecommendations(songId: string, limit: number): Promise<SongDTO[]> {
        try {
            const song = await Song.findById(songId);
            if (!song) return [];

            const recommendations = await Song.find({
                $or: [
                    { genres: { $in: song.genres } },
                    { author: song.author }
                ],
                _id: { $ne: song._id }
            })
                .limit(limit)
                .sort({ plays: -1 });

            return recommendations.map(song => SongDTO.fromDocument(song));
        } catch (error) {
            console.error('Error al obtener recomendaciones:', error);
            return [];
        }
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