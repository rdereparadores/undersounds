import { Types } from "mongoose"

export interface AddressDTO {
    alias: string,
    name: string,
    sur_name: string,
    phone: number,
    address: string,
    address_2?: string,
    province: string,
    city: string,
    zip_code: number,
    country: string,
    observations?: string,
    default: boolean
}

export interface BaseUserDTOProps {
    _id: string,
    name: string,
    sur_name: string,
    user_name: string,
    birth_date: Date,
    email: string,
    uid: string,
    img_url: string,
    user_type: 'user' | 'artist',
    following: string[],
    library: string[],
    listening_history: string[],
    addresses: AddressDTO[]
}

export class BaseUserDTO implements BaseUserDTOProps {
    _id: string
    name: string
    sur_name: string
    user_name: string
    birth_date: Date
    email: string
    uid: string
    img_url: string
    user_type: 'user' | 'artist'
    following: string[]
    library: string[]
    listening_history: string[]
    addresses: AddressDTO[]

    constructor(props: BaseUserDTOProps) {
        this._id = props._id
        this.name = props.name
        this.sur_name = props.sur_name
        this.user_name = props.user_name
        this.birth_date = props.birth_date
        this.email = props.email
        this.uid = props.uid
        this.img_url = props.img_url
        this.user_type = props.user_type
        this.following = props.following || []
        this.library = props.library || []
        this.listening_history = props.listening_history || []
        this.addresses = props.addresses || []
    }

    toJson(): BaseUserDTOProps {
        return {
            _id: this._id,
            name: this.name,
            sur_name: this.sur_name,
            user_name: this.user_name,
            birth_date: this.birth_date,
            email: this.email,
            uid: this.uid,
            img_url: this.img_url,
            user_type: this.user_type,
            following: this.following,
            library: this.library,
            listening_history: this.listening_history,
            addresses: this.addresses
        }
    }

}