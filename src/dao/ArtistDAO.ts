import { ArtistDTO } from "../dto/ArtistDTO"
import { BaseUserDTO } from "../dto/BaseUserDTO"
import { IBaseUserDAO } from "./BaseUserDAO"

export interface IArtistDAO extends IBaseUserDAO {
    create(dto: ArtistDTO): Promise<ArtistDTO>

    findById(_id: string): Promise<ArtistDTO | null>
    findByName(artistName: string): Promise<ArtistDTO | null>
    findByArtistUsername(artistUsername: string): Promise<ArtistDTO | null>
    findByEmail(email: string): Promise<ArtistDTO | null>
    findByUid(uid: string): Promise<ArtistDTO | null>

    getAll(): Promise<ArtistDTO[]>

    update(dto: ArtistDTO): Promise<ArtistDTO | null>

    delete(dto: ArtistDTO): Promise<boolean>
}