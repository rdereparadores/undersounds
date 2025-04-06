import { ProductDTO, ProductDTOProps } from "./ProductDTO";

export interface AlbumDTOProps extends ProductDTOProps {
    track_list: string[],
    version_history?: string[]
}

export class AlbumDTO extends ProductDTO implements AlbumDTOProps {
    track_list: string[]
    version_history?: string[]

    constructor(props: AlbumDTOProps) {
        super(props)
        this.track_list = props.track_list
        this.version_history = props.version_history
    }

    override toJson(): AlbumDTOProps {
        return {
            ...super.toJson(),
            track_list: this.track_list,
            version_history: this.version_history
        }
    }
}