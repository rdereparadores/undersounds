import {ArtistDTO} from "../dto/ArtistDTO";
import {AddressDTO} from "../dto/BaseUserDTO";
import {ProductDTO} from "../dto/ProductDTO";
import {UserDTO} from "../dto/UserDTO";
import {User} from "../models/User"
import {BaseUserDAO, IBaseUserDAO} from "./BaseUserDAO";
import {BaseUser} from "../models/BaseUser";
import {Types} from "mongoose";
import {Song} from "../models/Song";

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
    isFollowing(user: UserDTO, artist: ArtistDTO): Promise<boolean>
    removeFromFollowing(user: UserDTO, artist: ArtistDTO): Promise<UserDTO | null>

    addToLibrary(user: UserDTO, product: ProductDTO): Promise<UserDTO | null>
    removeFromLibrary(user: UserDTO, product: ProductDTO): Promise<UserDTO | null>

    addToListeningHistory(user: UserDTO, product: ProductDTO): Promise<UserDTO | null>

    addAddress(user: UserDTO, address: AddressDTO): Promise<UserDTO | null>
    removeAddress(user: UserDTO, address: AddressDTO): Promise<UserDTO | null>

    getTotalListeningTime(songIds: string[], since: Date): Promise<number>
    getUserListeningTime(userId: string, songIds: string[], since: Date): Promise<number>
    getUserRankForArtist(artistId: string, userId: string, since: Date): Promise<{rank: number, totalFans: number, userListeningTime: number, artistTotalListeningTime: number}>
}

export class UserDAO extends BaseUserDAO implements IUserDAO{
    constructor() {super()}

    async create(dto: UserDTO): Promise<UserDTO> {
        const newUser = await User.create(dto.toJson());
        return UserDTO.fromDocument(newUser);
    }

    async findById(_id: string): Promise<UserDTO | null> {
        const user = await User.findById(_id);
        if (!user) return null;
        return UserDTO.fromDocument(user);
    }

    async findByUsername(username: string): Promise<UserDTO | null> {
        const user = await User.findOne({ user_name: username });
        if (!user) return null;
        return UserDTO.fromDocument(user);
    }

    async findByEmail(email: string): Promise<UserDTO | null> {
        const emailUser = await User.findOne({email: email});
        if (!emailUser) return null;
        return UserDTO.fromDocument(emailUser);
    }

    async findByUid(uid: string): Promise<UserDTO | null> {
        const uidUser = await User.findOne({uid: uid});
        if (!uidUser) return null;
        return UserDTO.fromDocument(uidUser);
    }

    async getAll(): Promise<UserDTO[]> {
        const users = await User.find();
        return users.map(user => UserDTO.fromDocument(user));
    }

    async update(dto: UserDTO): Promise<UserDTO | null> {
        const updateUser = await User.findByIdAndUpdate(dto._id,
            { ...dto.toJson() },
            { new: true }
        );
        if(!updateUser) return null;
        return UserDTO.fromDocument(updateUser);
    }

    async delete(dto: UserDTO): Promise<boolean> {
        const deletedUser = await User.findByIdAndDelete(dto._id);
        return deletedUser !== null
    }

    async addToFollowing(user: UserDTO, artist: ArtistDTO): Promise<UserDTO | null >{
        const follow = await User.findByIdAndUpdate(user._id,
            { $push: { following: artist._id }},
            { new: true }
        );
        if (!follow) return null;
        return UserDTO.fromDocument(follow);
    }

    async isFollowing(user: UserDTO, artist: ArtistDTO): Promise<boolean>{
        const isFollow = await User.findById(user._id);
        if (!isFollow) return false;

        return  isFollow.following.some(follow => follow.toString() === artist._id);
    }

    async removeFromFollowing(user: UserDTO, artist: ArtistDTO): Promise<UserDTO | null> {
        const unfollow = await User.findByIdAndUpdate(user._id,
            { $pull: { following: artist._id }},
            { new: true }
        );
        if(!unfollow) return null;
        return UserDTO.fromDocument(unfollow);
    }

    async addToLibrary(user: UserDTO, product: ProductDTO): Promise<UserDTO | null> {
        const updatedLibrary = await User.findByIdAndUpdate(user._id,
            { $push: { library: product._id } },
            { new: true }
        );
        if (!updatedLibrary) return null;
        return UserDTO.fromDocument(updatedLibrary);
    }

    async removeFromLibrary(user: UserDTO, product: ProductDTO): Promise<UserDTO | null> {
        const updatedLibrary = await User.findByIdAndUpdate(user._id,
            { $pull: { library: product._id }},
            { new: true }
        );
        if (!updatedLibrary) return null;
        return UserDTO.fromDocument(updatedLibrary);
    }

    async addToListeningHistory(user: UserDTO, product: ProductDTO): Promise<UserDTO | null> {
        const updatedListeningHistory = await User.findByIdAndUpdate(user._id,
            { $push: { listening_history: product._id}},
            { new: true }
        );
        if (!updatedListeningHistory) return null;
        return UserDTO.fromDocument(updatedListeningHistory);
    }

    async addAddress(user: UserDTO, address: AddressDTO): Promise<UserDTO | null> {
        const updatedUser = await User.findByIdAndUpdate(user._id,
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
        return UserDTO.fromDocument(updatedUser);
    }

    async removeAddress(user: UserDTO, address: AddressDTO): Promise<UserDTO | null> {
        const updatedAddress = await User.findByIdAndUpdate(user._id,
            { $pull: {addresses: { _id: address._id } } },
            { new: true }
        );
        if (!updatedAddress) return null;
        return UserDTO.fromDocument(updatedAddress);
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

            const artistSongIds = artistSongs.map(song => song._id);

            if (artistSongIds.length === 0) {
                return {
                    rank: 0,
                    totalFans: 0,
                    userListeningTime: 0,
                    artistTotalListeningTime: 0
                };
            }

            const userRankings = await BaseUser.aggregate([
                { $unwind: "$listening_history" },
                {
                    $match: {
                        "listening_history.played_at": { $gte: since },
                        "listening_history.song": { $in: artistSongIds }
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
                        totalListeningTime: { $sum: "$songDetails.duration" }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        totalListeningTime: { $divide: ["$totalListeningTime", 60] }
                    }
                },
                { $sort: { totalListeningTime: -1 } }
            ]);

            const artistTotalListeningTime = userRankings.reduce(
                (total, user) => total + user.totalListeningTime,
                0
            );

            const userIndex = userRankings.findIndex(item => item._id.toString() === userId);
            const userRank = userIndex !== -1 ? userIndex + 1 : 0;
            const userListeningTime = userIndex !== -1 ? userRankings[userIndex].totalListeningTime : 0;
            const totalFans = userRankings.length;

            return {
                rank: userRank,
                totalFans: totalFans,
                userListeningTime: userListeningTime,
                artistTotalListeningTime: artistTotalListeningTime
            };
        } catch (error) {
            console.error('Error al obtener ranking del usuario:', error);
            return {
                rank: 0,
                totalFans: 0,
                userListeningTime: 0,
                artistTotalListeningTime: 0
            };
        }
    }
}