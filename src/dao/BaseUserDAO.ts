import { ArtistDTO } from "../dto/ArtistDTO";
import { AddressDTO, BaseUserDTO } from "../dto/BaseUserDTO";
import { ProductDTO } from "../dto/ProductDTO";
import { BaseUser } from "../models/BaseUser";

export interface IBaseUserDAO {

    create(dto: BaseUserDTO): Promise<BaseUserDTO>

    findById(_id: string): Promise<BaseUserDTO | null>
    findByUsername(user_name: string): Promise<BaseUserDTO | null>
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

export class BaseUserDAO implements IBaseUserDAO {
    constructor() {}

    async create(dto: BaseUserDTO): Promise<BaseUserDTO> {
        const newBaseUser = await BaseUser.create(dto.toJson());
        return BaseUserDTO.fromDocument(newBaseUser);
    }

    async findById(_id: string): Promise<BaseUserDTO | null> {
        const baseUser = await BaseUser.findById(_id)
        if (!baseUser) return null

        return BaseUserDTO.fromDocument(baseUser)
    }

    async findByUsername(user_name: string): Promise<BaseUserDTO | null> {
        const baseUsername = await BaseUser.findOne({ user_name })
        if(!baseUsername) return null;
        return BaseUserDTO.fromDocument(baseUsername);
    }

    async findByEmail(email: string): Promise<BaseUserDTO | null> {
        const userEmail = await BaseUser.findOne({ email })
        if (!userEmail) return null;
        return BaseUserDTO.fromDocument(userEmail);
    }

    async findByUid(uid: string): Promise<BaseUserDTO | null> {
        const userUid = await BaseUser.findOne({ uid })
        if (!userUid) return null;
        return BaseUserDTO.fromDocument(userUid);
    }

    async getAll(): Promise<BaseUserDTO[]> {
        const baseUsers = await BaseUser.find();
        return baseUsers.map(baseUser => BaseUserDTO.fromDocument(baseUser));
    }

    async update(dto: BaseUserDTO): Promise<BaseUserDTO | null> {
        const updatedUser = await BaseUser.findByIdAndUpdate(dto._id,
            { ...dto.toJson() },
            { new: true }
        );
        if (!updatedUser) return null;
        return BaseUserDTO.fromDocument(updatedUser);
    }

    async delete(dto: BaseUserDTO): Promise<boolean> {
        const result = await BaseUser.findByIdAndDelete(dto._id);
        return result !== null;
    }

    async addToFollowing(baseUser: BaseUserDTO, artist: ArtistDTO): Promise<BaseUserDTO | null> {
        const follow = await BaseUser.findByIdAndUpdate(baseUser._id,
            { $push: { following: artist._id }},
            { new: true }
        );
        if (!follow) return null;
        return BaseUserDTO.fromDocument(follow);
    }

    async removeFromFollowing(baseUser: BaseUserDTO, artist: ArtistDTO): Promise<BaseUserDTO | null> {
        const unfollow = await BaseUser.findByIdAndUpdate(baseUser._id,
            { $pull: { following: artist._id } },
            { new: true }
        );
        if (!unfollow) return null;
        return BaseUserDTO.fromDocument(unfollow);
    }

    async addToLibrary(baseUser: BaseUserDTO, product: ProductDTO): Promise<BaseUserDTO | null> {
        const updatedLibrary = await BaseUser.findByIdAndUpdate(baseUser._id,
            { $push: { library: product._id }},
            { new: true }
        );
        if (!updatedLibrary) return null;
        return BaseUserDTO.fromDocument(updatedLibrary);
    }

    async removeFromLibrary(baseUser: BaseUserDTO, product: ProductDTO): Promise<BaseUserDTO | null> {
        const updatedLibrary = await BaseUser.findByIdAndUpdate(baseUser._id,
            { $pull: { library: product._id }},
            { new: true }
        );
        if(!updatedLibrary) return null;
        return BaseUserDTO.fromDocument(updatedLibrary);
    }

    async addToListeningHistory(baseUser: BaseUserDTO, product: ProductDTO): Promise<BaseUserDTO | null> {
        const updatedListeningHistory = await BaseUser.findByIdAndUpdate(baseUser._id,
            { $push: { listening_history: product._id }},
            { new: true }
        );
        if (!updatedListeningHistory) return null;
        return BaseUserDTO.fromDocument(updatedListeningHistory);
    }

    async addAddress(baseUser: BaseUserDTO, address: AddressDTO): Promise<BaseUserDTO | null> {
        const updatedUser = await BaseUser.findByIdAndUpdate(baseUser._id,
            { $push: {
                addresses: {
                        alias: address.alias,
                        name: address.name,
                        sur_name: address.sur_name,
                        phone: address.phone,
                        address: address.address,
                        address_2: address.address_2,
                        province: address.province,
                        city: address.city,
                        zip_code: address.zip_code,
                        country: address.country,
                        observations: address.observations,
                        default: address.default
                    }
                }
            },
            { new: true }
        );
        if (!updatedUser) return null;
        return BaseUserDTO.fromDocument(updatedUser);
    }

    async removeAddress(baseUser: BaseUserDTO, address: AddressDTO): Promise<BaseUserDTO | null> {
        const updatedAddress = await BaseUser.findByIdAndUpdate(baseUser._id,
            { $pull: {addresses: { alias: address.alias } } },
            { new: true }
        );
        if (!updatedAddress) return null;
        return BaseUserDTO.fromDocument(updatedAddress);
    }

}