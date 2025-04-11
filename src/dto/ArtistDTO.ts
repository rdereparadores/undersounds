import { IArtist } from "../models/Artist";
import { BaseUserDTO, BaseUserDTOProps } from "./BaseUserDTO";

export interface ArtistDTOProps extends BaseUserDTOProps {
    artist_name: string,
    artist_user_name: string,
    bank_account?: string,
    artist_img_url: string,
    artist_banner_img_url: string
}

export class ArtistDTO extends BaseUserDTO implements ArtistDTOProps{
    artist_name: string
    artist_user_name: string
    bank_account?: string
    artist_img_url: string
    artist_banner_img_url: string

    constructor(props: ArtistDTOProps) {
        super(props)

        this.artist_name = props.artist_name
        this.artist_user_name = props.artist_user_name
        this.bank_account = props.bank_account
        this.artist_img_url = props.artist_img_url
        this.artist_banner_img_url = props.artist_banner_img_url
    }

    override toJson(): ArtistDTOProps {
        return {
            ...super.toJson(),
            artist_name: this.artist_name,
            artist_user_name: this.artist_user_name,
            bank_account: this.bank_account,
            artist_img_url: this.artist_img_url,
            artist_banner_img_url: this.artist_banner_img_url
        }
    }

    static fromDocument(doc: IArtist): ArtistDTO {
        const baseUserProps = BaseUserDTO.fromDocument(doc).toJson()
        return new ArtistDTO({
            ...baseUserProps,
            artist_name: doc.artist_name,
            artist_user_name: doc.artist_user_name,
            bank_account: doc.bank_account,
            artist_img_url: doc.artist_img_url,
            artist_banner_img_url: doc.artist_banner_img_url
        })
    }
}