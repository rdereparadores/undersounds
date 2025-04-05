import { Schema } from 'mongoose'
import BaseUser from './BaseUserModel'
import { IArtist } from './interfaces/IArtist'

const ArtistSchema = new Schema({
    artist_name: { type: String, required: true },
    artist_user_name: { type: String, required: true },
    bank_account: { type: String }
});

const Artist = BaseUser.discriminator<IArtist>('Artist', ArtistSchema)

export default Artist