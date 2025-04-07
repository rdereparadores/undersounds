import { IArtist } from "../models/Artist";
import { BaseUserDTO, BaseUserDTOProps } from "./BaseUserDTO";

export interface ArtistDTOProps extends BaseUserDTOProps {
    artist_name: string,
    artist_user_name: string,
    bank_account?: string
}

export class ArtistDTO extends BaseUserDTO implements ArtistDTOProps{
    artist_name: string
    artist_user_name: string
    bank_account?: string

    constructor(props: ArtistDTOProps) {
        super(props)

        this.artist_name = props.artist_name
        this.artist_user_name = props.artist_user_name
        this.bank_account = props.bank_account
    }

    override toJson(): ArtistDTOProps {
        return {
            ...super.toJson(),
            artist_name: this.artist_name,
            artist_user_name: this.artist_user_name,
            bank_account: this.bank_account
        }
    }

    static fromDocument(doc: IArtist): ArtistDTO {
        const baseUserProps = BaseUserDTO.fromDocument(doc).toJson()
        return new ArtistDTO({
            ...baseUserProps,
            artist_name: doc.artist_name,
            artist_user_name: doc.artist_user_name,
            bank_account: doc.bank_account
        })
    }
}