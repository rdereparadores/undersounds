import { Types } from "mongoose";
import { IPricing } from "./IProduct";

export interface IAlbumVersion {
    title: string,
    description: string,
    img_url: string,
    duration: number,
    pricing: IPricing,
    createdAt: Date,
    track_list: Types.ObjectId[]
}