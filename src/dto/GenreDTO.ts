export interface GenreDTOProps {
    _id: string;
    genre: string;
}

export class GenreDTO {
    _id!: string;
    genre!: string;

    constructor(props: GenreDTOProps) {
        Object.assign(this, props)
    }

    toJson() {
        return {
            ...this
        }
    }
}