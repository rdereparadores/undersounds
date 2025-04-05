import { GenreDTO } from './GenreDTO';
import { ArtistDTO } from './ArtistDTO';
import { ProductDTO, ProductDTOProps } from './ProductDTO';

export interface SongDTOProps extends ProductDTOProps {
    song_dir: string;
    plays: number;
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
        }
        song_dir: string,
        createdAt: Date
    }[]
    collaborators: ArtistDTO[]
    genres: GenreDTO[]
}

export class SongDTO extends ProductDTO {
    song_dir!: string;
    plays!: number;
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
        }
        song_dir: string,
        createdAt: Date
    }[]
    collaborators!: ArtistDTO[]
    genres!: GenreDTO[]

    constructor(props: SongDTOProps) {
        super(props)
        Object.assign(this, props)
    }

    override toJson() {
        return {
            ...this
        }
    }
}