import mongoose, { model, Schema } from "mongoose";
import { BaseUser, IBaseUser } from "./BaseUser";

export interface IArtist extends IBaseUser {
    artist_name: string,
    artist_user_name: string,
    artist_img_url: string,
    artist_banner_img_url: string,
    bank_account: string
}

const ArtistSchema = new Schema<IArtist>({
    artist_name: { type: String, required: true },
    artist_user_name: { type: String, required: true },
    artist_img_url: { type: String, default: '' },
    artist_banner_img_url: { type: String, default: '' },
    bank_account: { type: String }
})

export const Artist = BaseUser.discriminator<IArtist>('artist', ArtistSchema)