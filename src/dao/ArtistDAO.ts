import { ArtistDTO } from "../dto/ArtistDTO"
import {BaseUserDAO, IBaseUserDAO} from "./BaseUserDAO"
import { Artist } from "../models/Artist"

export interface IArtistDAO extends IBaseUserDAO {
    create(dto: ArtistDTO): Promise<ArtistDTO>

    findById(_id: string): Promise<ArtistDTO | null>
    findByName(artistName: string): Promise<ArtistDTO[] | null>
    findByArtistUsername(artistUsername: string): Promise<ArtistDTO | null>
    findByEmail(email: string): Promise<ArtistDTO | null>
    findByUid(uid: string): Promise<ArtistDTO | null>

    getAll(): Promise<ArtistDTO[]>

    update(dto: ArtistDTO): Promise<ArtistDTO | null>

    delete(dto: ArtistDTO): Promise<boolean>
}

export class ArtistDAO extends BaseUserDAO implements IArtistDAO {
    constructor() {super()}

    async create(dto: ArtistDTO): Promise<ArtistDTO> {
        const newArtist = await Artist.create(dto.toJson());
        return ArtistDTO.fromDocument(newArtist);
    }

    async findById(_id: string): Promise<ArtistDTO | null> {
        const artist = await Artist.findById(_id);
        if (!artist) return null;
        return ArtistDTO.fromDocument(artist);
    }

    async findByName(artistName: string): Promise<ArtistDTO[] | null > {
        const artists = await Artist.find({artist_name: artistName});
        return artists.map(ArtistDTO.fromDocument);
    }

    async findByArtistUsername(artistUsername: string): Promise<ArtistDTO | null> {
        const artist = await Artist.findOne({artist_user_name: artistUsername });
        if (!artist) return null;
        return ArtistDTO.fromDocument(artist);
    }

    async findByEmail(email: string): Promise<ArtistDTO | null> {
        const emailArtist = await Artist.findOne({email: email});
        if (!emailArtist) return null;
        return ArtistDTO.fromDocument(emailArtist);
    }

    async findByUid(uid: string): Promise<ArtistDTO | null> {
        const uidArtist = await Artist.findOne({uid: uid});
        if (!uidArtist) return null;
        return ArtistDTO.fromDocument(uidArtist);
    }

    async getAll(): Promise<ArtistDTO[]> {
        const artists = await Artist.find();
        return artists.map(artist => ArtistDTO.fromDocument(artist));
    }

    async update(dto: ArtistDTO): Promise<ArtistDTO | null> {
        const updatedArtist = await Artist.findByIdAndUpdate(dto._id,
            { ...dto.toJson() },
            { new: true }
        );
        if(!updatedArtist) return null;
        return ArtistDTO.fromDocument(updatedArtist);
    }

    async delete(dto: ArtistDTO): Promise<boolean> {
        const deletedArtist = await Artist.findByIdAndDelete(dto._id);
        return deletedArtist !== null
    }

}