import { ISong } from "../models/Song";
import { ProductDTO, ProductDTOProps } from "./ProductDTO";

export interface SongDTOProps extends ProductDTOProps {
    song_dir: string,
    duration: number,
    plays: number,
    genres: string[],
    collaborators: {
        artist: string,
        accepted: boolean
    }[],
    version_history?: string[]
}

export class SongDTO extends ProductDTO implements SongDTOProps {
    song_dir: string
    duration: number
    plays: number
    genres: string[]
    collaborators: {
        artist: string,
        accepted: boolean
    }[]
    version_history?: string[]

    constructor(props: SongDTOProps) {
        super(props)
        this.song_dir = props.song_dir
        this.duration = props.duration
        this.plays = props.plays
        this.genres = props.genres
        this.collaborators = props.collaborators
        this.version_history = props.version_history
    }

    override toJson(): SongDTOProps {
        return {
            ...super.toJson(),
            song_dir: this.song_dir,
            duration: this.duration,
            plays: this.plays,
            genres: this.genres,
            collaborators: this.collaborators,
            version_history: this.version_history
        }
    }

    static fromDocument(doc: ISong): SongDTO {
        const productProps = ProductDTO.fromDocument(doc).toJson()
        return new SongDTO({
            ...productProps,
            song_dir: doc.song_dir,
            duration: doc.duration,
            plays: doc.plays,
            genres: doc.genres.map(genre => genre.toString()),
            collaborators: doc.collaborators.map(collaborator => (
                { 
                    artist: collaborator.artist.toString(),
                    accepted: collaborator.accepted
                })),
            version_history: doc.version_history.map(version => version.toString())
        })
    }
}