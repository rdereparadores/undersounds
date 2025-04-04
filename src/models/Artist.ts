import { Schema } from 'mongoose';
import User, { IUser } from './User';

export interface IArtist extends IUser {
    artist_name: string;
    artist_user_name: string;
    bank_account: string;
    toObject(): any;
}

const ArtistSchema = new Schema({
    artist_name: { type: String, required: true },
    artist_user_name: { type: String, required: true },
    bank_account: { type: String }
}, { timestamps: true });

const Artist = User.discriminator<IArtist>('Artist', ArtistSchema);

export default Artist;
