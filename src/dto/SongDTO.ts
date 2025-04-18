import { ISong } from "../models/Song"
import { ProductDTO, ProductDTOProps } from "./ProductDTO"

export interface SongDTOProps extends ProductDTOProps {
    songDir: string,
    plays: number,
    collaborators: {
        artist: string,
        accepted: boolean
    }[],
    versionHistory?: string[]
}

export class SongDTO extends ProductDTO implements SongDTOProps {
    songDir: string
    plays: number
    collaborators: {
        artist: string,
        accepted: boolean
    }[]
    versionHistory?: string[]

    constructor(props: SongDTOProps) {
        super(props)
        this.songDir = props.songDir
        this.plays = props.plays
        this.collaborators = props.collaborators
        this.versionHistory = props.versionHistory
    }

    override toJson(): SongDTOProps {
        return {
            ...super.toJson(),
            songDir: this.songDir,
            plays: this.plays,
            collaborators: this.collaborators,
            versionHistory: this.versionHistory
        }
    }

    static fromDocument(doc: ISong): SongDTO {
        const productProps = ProductDTO.fromDocument(doc).toJson()
        return new SongDTO({
            ...productProps,
            songDir: doc.songDir,
            plays: doc.plays,
            collaborators: doc.collaborators.map(collaborator => (
                { 
                    artist: collaborator.artist.toString(),
                    accepted: collaborator.accepted
                })),
            versionHistory: doc.versionHistory.map(version => version.toString())
        })
    }
}