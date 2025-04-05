import { UserDTO, UserDTOProps } from "./UserDTO";

export interface ArtistDTOProps extends UserDTOProps {
    artist_name: string,
    artist_user_name: string,
    bank_account: string
}

export class ArtistDTO extends UserDTO {
    artist_name!: string
    artist_user_name!: string
    bank_account!: string

    constructor(props: ArtistDTOProps) {
        super(props)
        Object.assign(this, props)
    }

    toJson() {
        return {
            ...this
        }
    }
}