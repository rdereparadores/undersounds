import { ArtistDTO } from "../dto/ArtistDTO"
import { AddressDTO, BaseUserDTO } from "../dto/BaseUserDTO"
import { ProductDTO } from "../dto/ProductDTO"
import { BaseUser } from "../models/BaseUser"

export interface IBaseUserDAO {

    create(baseUser: BaseUserDTO): Promise<BaseUserDTO>

    findById(_id: string): Promise<BaseUserDTO | null>
    findByUsername(username: string): Promise<BaseUserDTO | null>
    findByEmail(email: string): Promise<BaseUserDTO | null>
    findByUid(uid: string): Promise<BaseUserDTO | null>

    getAll(): Promise<BaseUserDTO[]>

    update(baseUser: BaseUserDTO): Promise<boolean>

    delete(baseUser: BaseUserDTO): Promise<boolean>

    addToFollowing(baseUser: Partial<BaseUserDTO>, artist: Partial<ArtistDTO>): Promise<boolean>
    removeFromFollowing(baseUser: Partial<BaseUserDTO>, artist: Partial<ArtistDTO>): Promise<boolean>

    addToLibrary(baseUser: Partial<BaseUserDTO>, product: Partial<ProductDTO>): Promise<boolean>
    removeFromLibrary(baseUser: Partial<BaseUserDTO>, product: Partial<ProductDTO>): Promise<boolean>

    addToListeningHistory(baseUser: Partial<BaseUserDTO>, product: Partial<ProductDTO>): Promise<boolean>

    addAddress(baseUser: Partial<BaseUserDTO>, address: AddressDTO): Promise<boolean>
    removeAddress(baseUser: Partial<BaseUserDTO>, address: Partial<AddressDTO>): Promise<boolean>
    setAddressAsDefault(baseUser: Partial<BaseUserDTO>, address: Partial<AddressDTO>): Promise<boolean>

    getListenersOfArtist(artist: Partial<ArtistDTO>, date: Date): Promise<number>
}

export class BaseUserDAO implements IBaseUserDAO {
    constructor() { }

    async create(baseUser: BaseUserDTO): Promise<BaseUserDTO> {
        const newBaseUser = await BaseUser.create(baseUser)
        return BaseUserDTO.fromDocument(newBaseUser)
    }

    async findById(_id: string): Promise<BaseUserDTO | null> {
        const baseUser = await BaseUser.findById(_id)
        if (baseUser === null) return null

        return BaseUserDTO.fromDocument(baseUser)
    }

    async findByUsername(username: string): Promise<BaseUserDTO | null> {
        const baseUser = await BaseUser.findOne({ username })
        if (baseUser === null) return null

        return BaseUserDTO.fromDocument(baseUser)
    }

    async findByEmail(email: string): Promise<BaseUserDTO | null> {
        const baseUser = await BaseUser.findOne({ email })
        if (baseUser === null) return null

        return BaseUserDTO.fromDocument(baseUser)
    }

    async findByUid(uid: string): Promise<BaseUserDTO | null> {
        const baseUser = await BaseUser.findOne({ uid })
        if (baseUser === null) return null

        return BaseUserDTO.fromDocument(baseUser)
    }

    async getAll(): Promise<BaseUserDTO[]> {
        const baseUsers = await BaseUser.find()
        return baseUsers.map(baseUser => BaseUserDTO.fromDocument(baseUser))
    }

    async update(baseUser: Partial<BaseUserDTO>): Promise<boolean> {
        const updatedBaseUser = await BaseUser.findByIdAndUpdate(baseUser._id,
            { ...baseUser.toJson!() },
            { new: true }
        )

        return updatedBaseUser !== null
    }

    async delete(baseUser: Partial<BaseUserDTO>): Promise<boolean> {
        const result = await BaseUser.findByIdAndDelete(baseUser._id)
        return result !== null
    }

    async addToFollowing(baseUser: Partial<BaseUserDTO>, artist: Partial<ArtistDTO>): Promise<boolean> {
        const follow = await BaseUser.findByIdAndUpdate(baseUser._id,
            { $push: { following: artist._id } },
            { new: true }
        )
        return follow !== null
    }

    async removeFromFollowing(baseUser: Partial<BaseUserDTO>, artist: Partial<ArtistDTO>): Promise<boolean> {
        const unfollow = await BaseUser.findByIdAndUpdate(baseUser._id,
            { $pull: { following: artist._id } },
            { new: true }
        )
        return unfollow !== null
    }

    async addToLibrary(baseUser: Partial<BaseUserDTO>, product: Partial<ProductDTO>): Promise<boolean> {
        const updatedBaseUser = await BaseUser.findByIdAndUpdate(baseUser._id,
            { $push: { library: product._id } },
            { new: true }
        )
        return updatedBaseUser !== null
    }

    async removeFromLibrary(baseUser: Partial<BaseUserDTO>, product: Partial<ProductDTO>): Promise<boolean> {
        const updatedBaseUser = await BaseUser.findByIdAndUpdate(baseUser._id,
            { $pull: { library: product._id } },
            { new: true }
        )
        return updatedBaseUser !== null
    }

    async addToListeningHistory(baseUser: Partial<BaseUserDTO>, product: Partial<ProductDTO>): Promise<boolean> {
        const updatedBaseUser = await BaseUser.findByIdAndUpdate(baseUser._id,
            { $push: { listeningHistory: { song: product._id!, playedAt: new Date() } } },
            { new: true }
        );
        return updatedBaseUser !== null
    }

    async addAddress(baseUser: Partial<BaseUserDTO>, address: AddressDTO): Promise<boolean> {
        const updatedBaseUser = await BaseUser.findByIdAndUpdate(baseUser._id,
            {
                $push: {
                    addresses: {
                        ...address
                    }
                }
            },
            { new: true }
        )
        return updatedBaseUser !== null
    }

    async removeAddress(baseUser: Partial<BaseUserDTO>, address: Partial<AddressDTO>): Promise<boolean> {
        const updatedBaseUser = await BaseUser.findByIdAndUpdate(baseUser._id,
            { $pull: { addresses: { alias: address.alias } } },
            { new: true }
        )
        return updatedBaseUser !== null
    }

    async setAddressAsDefault(baseUser: Partial<BaseUserDTO>, address: Partial<AddressDTO>): Promise<boolean> {
        try {
            await BaseUser.updateOne(
                { _id: baseUser._id },
                { $set: { 'addresses.$[].default': false } }
            )
            await BaseUser.updateOne(
                { _id: baseUser._id, 'addresses._id': address._id },
                { $set: { 'addresses.$.default': true } }
            )
            return true
        } catch {
            return false
        }
    }

    async getListenersOfArtist(artist: Partial<ArtistDTO>, date: Date): Promise<number> {
        const users = await BaseUser.find().populate('listeningHistory.song')
        const listeners = users.filter(user => {
            let isListener = false
            user.listeningHistory.forEach(entry => {
                const song = entry.song as unknown as ProductDTO
                const playedAt = new Date(entry.playedAt)
                const validDate = playedAt.getMonth() === date.getMonth() && playedAt.getFullYear() === date.getFullYear()
                if (song.author === artist._id! && validDate) {
                    isListener = true
                    return
                }
            })
            return isListener
        })
        return listeners.length

    }

}