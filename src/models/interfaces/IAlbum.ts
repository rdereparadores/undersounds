import { Document, Types } from 'mongoose';
import { IProduct } from './IProduct';
import { IAlbumVersion } from './IAlbumVersion';

export interface IAlbum extends IProduct {
    track_list: Types.ObjectId[], // Referencias a Song
    version_history: IAlbumVersion[]
}