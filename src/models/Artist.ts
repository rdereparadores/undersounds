import { Schema } from "mongoose"
import { BaseUser, IBaseUser } from "./BaseUser"

export interface IArtist extends IBaseUser {
    artistName: string,
    artistUsername: string,
    artistImgUrl: string,
    artistBannerUrl: string,
    bankAccount: string
}

const ArtistSchema = new Schema<IArtist>({
    artistName: { type: String, required: true },
    artistUsername: { type: String, required: true },
    artistImgUrl: { type: String, default: '/public/artist/profile/generic.jpg' },
    artistBannerUrl: { type: String, default: '/public/artist/banner/generic.jpg' },
    bankAccount: { type: String }
})

export const Artist = BaseUser.discriminator<IArtist>('artist', ArtistSchema)