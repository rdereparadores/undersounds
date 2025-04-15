import { IArtist } from "../models/Artist"
import { BaseUserDTO, BaseUserDTOProps } from "./BaseUserDTO"

export interface ArtistDTOProps extends BaseUserDTOProps {
    artistName: string,
    artistUsername: string,
    bankAccount?: string
}

export class ArtistDTO extends BaseUserDTO implements ArtistDTOProps{
    artistName: string
    artistUsername: string
    bankAccount?: string

    constructor(props: ArtistDTOProps) {
        super(props)

        this.artistName = props.artistName
        this.artistUsername = props.artistUsername
        this.bankAccount = props.bankAccount
    }

    override toJson(): ArtistDTOProps {
        return {
            ...super.toJson(),
            artistName: this.artistName,
            artistUsername: this.artistUsername,
            bankAccount: this.bankAccount
        }
    }

    static fromDocument(doc: IArtist): ArtistDTO {
        const baseUserProps = BaseUserDTO.fromDocument(doc).toJson()
        return new ArtistDTO({
            ...baseUserProps,
            artistName: doc.artistName,
            artistUsername: doc.artistUsername,
            bankAccount: doc.bankAccount
        })
    }
}