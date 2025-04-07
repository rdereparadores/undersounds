import { ArtistDTO } from "../dto/ArtistDTO";
import { AddressDTO, BaseUserDTO } from "../dto/BaseUserDTO";
import { ProductDTO } from "../dto/ProductDTO";

export interface IBaseUserDAO {

    create(dto: BaseUserDTO): Promise<BaseUserDTO>

    findById(_id: string): Promise<BaseUserDTO | null>
    findByUsername(username: string): Promise<BaseUserDTO | null>
    findByEmail(email: string): Promise<BaseUserDTO | null>
    findByUid(uid: string): Promise<BaseUserDTO | null>

    getAll(): Promise<BaseUserDTO[]>

    update(dto: BaseUserDTO): Promise<BaseUserDTO | null>

    delete(dto: BaseUserDTO): Promise<boolean>

    addToFollowing(baseUser: BaseUserDTO, artist: ArtistDTO): Promise<BaseUserDTO | null>
    removeFromFollowing(baseUser: BaseUserDTO, artist: ArtistDTO): Promise<BaseUserDTO | null>

    addToLibrary(baseUser: BaseUserDTO, product: ProductDTO): Promise<BaseUserDTO | null>
    removeFromLibrary(baseUser: BaseUserDTO, product: ProductDTO): Promise<BaseUserDTO | null>

    addToListeningHistory(baseUser: BaseUserDTO, product: ProductDTO): Promise<BaseUserDTO | null>

    addAddress(baseUser: BaseUserDTO, address: AddressDTO): Promise<BaseUserDTO | null>
    removeAddress(baseUser: BaseUserDTO, address: AddressDTO): Promise<BaseUserDTO | null>
}