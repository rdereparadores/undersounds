import { IBaseUser } from './IBaseUser'

export interface IArtist extends IBaseUser {
    artist_name: string
    artist_user_name: string
    bank_account: string
}