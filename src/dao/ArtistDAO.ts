import { ArtistDTO } from "../dto/ArtistDTO"
import { Artist } from "../models/Artist"
import { BaseUserDAO, IBaseUserDAO } from "./BaseUserDAO"

export interface IArtistDAO extends IBaseUserDAO {
    create(artist: ArtistDTO): Promise<ArtistDTO>

    findById(_id: string): Promise<ArtistDTO | null>
    findByUsername(username: string): Promise<ArtistDTO | null>
    findByEmail(email: string): Promise<ArtistDTO | null>
    findByUid(uid: string): Promise<ArtistDTO | null>
    findByArtistUsername(artistUsername: string): Promise<ArtistDTO | null>

    getAll(): Promise<ArtistDTO[]>

    update(artist: ArtistDTO): Promise<boolean>

    delete(artist: ArtistDTO): Promise<boolean>
}

export class ArtistDAO extends BaseUserDAO implements IArtistDAO {
    constructor() { super() }

    async create(artist: ArtistDTO): Promise<ArtistDTO> {
        const newArtist = await Artist.create(artist)
        return ArtistDTO.fromDocument(newArtist)
    }

    async findById(_id: string): Promise<ArtistDTO | null> {
        const artist = await Artist.findById(_id)
        if (artist === null) return null

        return ArtistDTO.fromDocument(artist)
    }

    async findByUsername(username: string): Promise<ArtistDTO | null> {
        const artist = await Artist.findOne({ username })
        if (artist === null) return null

        return ArtistDTO.fromDocument(artist)
    }

    async findByEmail(email: string): Promise<ArtistDTO | null> {
        const artist = await Artist.findOne({ email })
        if (artist === null) return null

        return ArtistDTO.fromDocument(artist)
    }

    async findByUid(uid: string): Promise<ArtistDTO | null> {
        const artist = await Artist.findOne({ uid })
        if (artist === null) return null

        return ArtistDTO.fromDocument(artist)
    }

    async findByArtistUsername(artistUsername: string): Promise<ArtistDTO | null> {
        const artist = await Artist.findOne({ artistUsername })
        if (artist === null) return null
        
        return ArtistDTO.fromDocument(artist)
    }

    async getAll(): Promise<ArtistDTO[]> {
        const artists = await Artist.find()
        return artists.map(artist => ArtistDTO.fromDocument(artist))
    }

    async update(artist: Partial<ArtistDTO>): Promise<boolean> {
        const updatedArtist = await Artist.findByIdAndUpdate(artist._id,
            { ...artist.toJson!() },
            { new: true }
        )

        return updatedArtist !== null
    }

    async delete(artist: Partial<ArtistDTO>): Promise<boolean> {
        const result = await Artist.findByIdAndDelete(artist._id)
        return result !== null
    }

}