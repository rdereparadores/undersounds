import { Schema } from "mongoose"
import { BaseUser, IBaseUser } from "./BaseUser"

export interface IArtist extends IBaseUser {
    artistName: string,
    artistUsername: string,
    bankAccount: string
}

const ArtistSchema = new Schema<IArtist>({
    artistName: { type: String, required: true },
    artistUsername: { type: String, required: true },
    bankAccount: { type: String }
})

export const Artist = BaseUser.discriminator<IArtist>('artist', ArtistSchema)