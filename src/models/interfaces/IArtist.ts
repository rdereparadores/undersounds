import { IUser } from './IUser';

export interface IArtist extends IUser {
    artist_name: string;
    artist_user_name: string;
    bank_account: string;
}