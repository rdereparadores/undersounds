import { IArtist } from "../models/Artist"
import { BaseUserDTO, BaseUserDTOProps } from "./BaseUserDTO"

export interface ArtistDTOProps extends BaseUserDTOProps {
    artistName: string,
    artistUsername: string,
    artistImgUrl: string,
    artistBannerUrl: string,
    followerCount: number,
    bankAccount?: string
}

export class ArtistDTO extends BaseUserDTO implements ArtistDTOProps{
    artistName: string
    artistUsername: string
    artistImgUrl: string
    artistBannerUrl: string
    followerCount: number
    bankAccount?: string

    constructor(props: ArtistDTOProps) {
        super(props)

        this.artistName = props.artistName
        this.artistUsername = props.artistUsername
        this.artistImgUrl = props.artistImgUrl
        this.artistBannerUrl = props.artistBannerUrl
        this.bankAccount = props.bankAccount
        this.followerCount = props.followerCount
    }

    override toJson(): ArtistDTOProps {
        return {
            ...super.toJson(),
            artistName: this.artistName,
            artistUsername: this.artistUsername,
            artistImgUrl: this.artistImgUrl,
            artistBannerUrl: this.artistBannerUrl,
            bankAccount: this.bankAccount,
            followerCount: this.followerCount
        }
    }

    static fromDocument(doc: IArtist): ArtistDTO {
        const baseUserProps = BaseUserDTO.fromDocument(doc).toJson()
        return new ArtistDTO({
            ...baseUserProps,
            artistName: doc.artistName,
            artistUsername: doc.artistUsername,
            artistImgUrl: doc.artistImgUrl,
            artistBannerUrl: doc.artistBannerUrl,
            bankAccount: doc.bankAccount,
            followerCount: doc.followerCount
        })
    }
}