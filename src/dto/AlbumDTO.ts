import { ProductDTO, ProductDTOProps } from './ProductDTO';
import { SongDTO, SongDTOProps } from './SongDTO';
import { GenreDTO } from './GenreDTO';
import { Types } from 'mongoose';

export interface AlbumDTOProps extends ProductDTOProps {
    track_list: Types.ObjectId[]
    version_history: {
        title: string,
        description: string,
        img_url: string,
        duration: number,
        pricing: {
            cd: number,
            digital: number,
            cassette: number,
            vinyl: number
        },
        createdAt: Date,
        track_list: Types.ObjectId[]
    }[]

}

export class AlbumDTO extends ProductDTO{
    track_list!: Types.ObjectId[]
    version_history!: {
        title: string,
        description: string,
        img_url: string,
        duration: number,
        pricing: {
            cd: number,
            digital: number,
            cassette: number,
            vinyl: number
        },
        createdAt: Date,
        track_list: Types.ObjectId[]
    }[]

    constructor(props: AlbumDTOProps) {
        super(props)
        Object.assign(this, props)
    }

    override toJson() {
        return {
            ...this
        }
    }
}