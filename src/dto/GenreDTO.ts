
export interface GenreDTOProps {
    _id: string,
    genre: string
}

export class GenreDTO implements GenreDTOProps {
    _id: string
    genre: string

    constructor(props: GenreDTOProps) {
        this._id = props._id
        this.genre = props.genre
    }

    toJson(): GenreDTOProps {
        return {
            _id: this._id,
            genre: this.genre
        }
    }
}