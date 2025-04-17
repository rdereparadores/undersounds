import { IAlbum } from "../models/Album"
import { ProductDTO, ProductDTOProps } from "./ProductDTO"

export interface AlbumDTOProps extends ProductDTOProps {
    trackList: string[],
    versionHistory?: string[]
}

export class AlbumDTO extends ProductDTO implements AlbumDTOProps {
    trackList: string[]
    versionHistory?: string[]

    constructor(props: AlbumDTOProps) {
        super(props)
        this.trackList = props.trackList
        this.versionHistory = props.versionHistory
    }

    override toJson(): AlbumDTOProps {
        return {
            ...super.toJson(),
            trackList: this.trackList,
            versionHistory: this.versionHistory
        }
    }

    static fromDocument(doc: IAlbum): AlbumDTO {
        const productProps = ProductDTO.fromDocument(doc).toJson()
        return new AlbumDTO({
            ...productProps,
            trackList: doc.trackList.map(track => track.toString()),
            versionHistory: doc.versionHistory.map(version => version.toString())
        })
    }
}