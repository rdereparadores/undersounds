import { ArtistDTO } from "../dto/ArtistDTO";
import { AddressDTO, BaseUserDTO } from "../dto/BaseUserDTO";
import { ProductDTO } from "../dto/ProductDTO";
import { BaseUser } from "../models/BaseUser";
import {Types} from "mongoose";
import {Song} from "../models/Song";

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
    getAddresses(user: BaseUserDTO): Promise<AddressDTO[] | null>
    setAddressAsDefault(user: BaseUserDTO, address: Partial<AddressDTO>): Promise<boolean>

    getTotalListeningTime(songIds: string[], since: Date): Promise<number>
    getUserListeningTime(userId: string, songIds: string[], since: Date): Promise<number>
    getUserRankForArtist(artistId: string, userId: string, since: Date): Promise<{rank: number, totalFans: number, userListeningTime: number, artistTotalListeningTime: number}>
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

    async removeAddress(baseUser: BaseUserDTO, address: Partial<AddressDTO>): Promise<BaseUserDTO | null> {
        const updatedAddress = await BaseUser.findByIdAndUpdate(baseUser._id,
            { $pull: {addresses: { _id: address._id } } },
            { new: true }
        );
        if (!updatedAddress) return null;
        return BaseUserDTO.fromDocument(updatedAddress);
    }

    async getAddresses(user: BaseUserDTO) {
        const userDoc = await BaseUser.findById(user._id).populate('addresses')
        const addresses: AddressDTO[] = userDoc!.addresses.map((address: any) => ({
            _id: address._id.toString(),
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
            default: address.default,
        }))
    
        return addresses
    }

    async setAddressAsDefault(user: BaseUserDTO, address: Partial<AddressDTO>): Promise<boolean> {
        try {
            await BaseUser.updateMany({}, {$set: { 'addresses.$[].default': false }})
            await BaseUser.updateOne(
                { _id: user._id, 'addresses._id': address._id },
                { $set: { 'addresses.$.default': true } }
            )
            return true
        } catch {
            return false
        }
    }

    async getTotalListeningTime(songIds: string[], since: Date): Promise<number> {
        try {
            const objectIds = songIds.map(id => new Types.ObjectId(id));

            const listeningAggregation = await BaseUser.aggregate([
                { $unwind: "$listening_history" },
                {
                    $match: {
                        "listening_history.played_at": { $gte: since },
                        "listening_history.song": { $in: objectIds }
                    }
                },
                {
                    $lookup: {
                        from: "songs",
                        localField: "listening_history.song",
                        foreignField: "_id",
                        as: "songDetails"
                    }
                },
                { $unwind: "$songDetails" },
                {
                    $group: {
                        _id: null,
                        totalDuration: { $sum: "$songDetails.duration" }
                    }
                }
            ]);

            return listeningAggregation.length > 0
                ? listeningAggregation[0].totalDuration / 60
                : 0;
        } catch (error) {
            console.error('Error al obtener tiempo total de escucha:', error);
            return 0;
        }
    }

    async getUserListeningTime(userId: string, songIds: string[], since: Date): Promise<number> {
        try {
            const objectIds = songIds.map(id => new Types.ObjectId(id));
            const userObjectId = new Types.ObjectId(userId);

            const userListeningAggregation = await BaseUser.aggregate([
                {
                    $match: {
                        _id: userObjectId
                    }
                },
                { $unwind: "$listening_history" },
                {
                    $match: {
                        "listening_history.played_at": { $gte: since },
                        "listening_history.song": { $in: objectIds }
                    }
                },
                {
                    $lookup: {
                        from: "songs",
                        localField: "listening_history.song",
                        foreignField: "_id",
                        as: "songDetails"
                    }
                },
                { $unwind: "$songDetails" },
                {
                    $group: {
                        _id: "$_id",
                        totalDuration: { $sum: "$songDetails.duration" }
                    }
                }
            ]);

            return userListeningAggregation.length > 0
                ? userListeningAggregation[0].totalDuration / 60
                : 0;
        } catch (error) {
            console.error('Error al obtener tiempo de escucha del usuario:', error);
            return 0;
        }
    }

    async getUserRankForArtist(artistId: string, userId: string, since: Date): Promise<{
        rank: number,
        totalFans: number,
        userListeningTime: number,
        artistTotalListeningTime: number
    }> {
        try {
            const artistObjectId = new Types.ObjectId(artistId);

            const artistSongs = await Song.find({
                $or: [
                    { author: artistObjectId },
                    { 'collaborators.artist': artistObjectId, 'collaborators.accepted': true }
                ]
            });

            if (artistSongs.length === 0) {
                return {
                    rank: 0,
                    totalFans: 0,
                    userListeningTime: 0,
                    artistTotalListeningTime: 0
                };
            }

            const artistSongIds = artistSongs.map(song => song._id);

            const users = await BaseUser.find({
                'listening_history': {
                    $elemMatch: {
                        'song': { $in: artistSongIds },
                        'played_at': { $gte: since }
                    }
                }
            });

            const userListeningTimes = [];
            let totalListeningTime = 0;

            for (const user of users) {
                let userTime = 0;

                const relevantHistory = user.listening_history.filter(entry => {
                    const songIdStr = entry.song.toString();
                    const entryDate = new Date(entry.played_at);
                    return artistSongIds.some(id => id.toString() === songIdStr) && entryDate >= since;
                });

                for (const entry of relevantHistory) {
                    const songId = entry.song;
                    const song = artistSongs.find(s => s._id.toString() === songId.toString());
                    if (song) {
                        userTime += song.duration / 60;
                    }
                }

                userListeningTimes.push({
                    userId: user._id.toString(),
                    time: userTime
                });

                totalListeningTime += userTime;
            }

            userListeningTimes.sort((a, b) => b.time - a.time);

            const userIndex = userListeningTimes.findIndex(item => item.userId === userId);
            const totalFans = userListeningTimes.length;

            if (userIndex === -1) {
                return {
                    rank: 0,
                    totalFans,
                    userListeningTime: 0,
                    artistTotalListeningTime: totalListeningTime
                };
            }

            const userRank = userIndex + 1;

            const userListeningTime = userListeningTimes[userIndex].time;

            return {
                rank: userRank,
                totalFans,
                userListeningTime,
                artistTotalListeningTime: totalListeningTime
            };
        } catch (error) {
            return {
                rank: 0,
                totalFans: 0,
                userListeningTime: 0,
                artistTotalListeningTime: 0
            };
        }
    }
}