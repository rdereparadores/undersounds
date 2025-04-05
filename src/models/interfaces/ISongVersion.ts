import { IPricing } from "./IProduct"

export interface ISongVersion {
    title: string,
    description: string,
    img_url: string,
    duration: number,
    pricing: IPricing,
    song_dir: string,
    createdAt: Date
}