import { ArtistDTO } from "../dto/ArtistDTO";
import { AddressDTO, BaseUserDTO } from "../dto/BaseUserDTO";
import { ProductDTO } from "../dto/ProductDTO";
import { UserDTO } from "../dto/UserDTO";
import { BaseUserDAO, IBaseUserDAO } from "./BaseUserDAO";

export interface IUserDAO extends IBaseUserDAO {
    create(dto: UserDTO): Promise<UserDTO>

    findById(_id: string): Promise<UserDTO | null>
    findByUsername(username: string): Promise<UserDTO | null>
    findByEmail(email: string): Promise<UserDTO | null>
    findByUid(uid: string): Promise<UserDTO | null>

    getAll(): Promise<UserDTO[]>

    update(dto: UserDTO): Promise<UserDTO | null>

    delete(dto: UserDTO): Promise<boolean>

    addToFollowing(user: UserDTO, artist: ArtistDTO): Promise<UserDTO | null>
    removeFromFollowing(baseUser: UserDTO, artist: ArtistDTO): Promise<UserDTO | null>

    addToLibrary(user: UserDTO, product: ProductDTO): Promise<UserDTO | null>
    removeFromLibrary(user: UserDTO, product: ProductDTO): Promise<UserDTO | null>

    addToListeningHistory(user: UserDTO, product: ProductDTO): Promise<UserDTO | null>

    addAddress(user: UserDTO, address: AddressDTO): Promise<UserDTO | null>
    removeAddress(user: UserDTO, address: AddressDTO): Promise<UserDTO | null>
}