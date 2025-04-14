import { IBaseUser } from "../models/BaseUser"

export interface AddressDTO {
    alias: string,
    name: string,
    surname: string,
    phone: number,
    address: string,
    address2?: string,
    province: string,
    city: string,
    zipCode: number,
    country: string,
    observations?: string,
    default: boolean
}

export interface BaseUserDTOProps {
    _id?: string,
    name: string,
    surname: string,
    username: string,
    birthDate: Date,
    email: string,
    uid: string,
    imgUrl: string,
    userType: 'user' | 'artist',
    following: string[],
    library: string[],
    listeningHistory: string[],
    addresses: AddressDTO[]
}

export class BaseUserDTO implements BaseUserDTOProps {
    _id?: string
    name: string
    surname: string
    username: string
    birthDate: Date
    email: string
    uid: string
    imgUrl: string
    userType: 'user' | 'artist'
    following: string[]
    library: string[]
    listeningHistory: string[]
    addresses: AddressDTO[]

    constructor(props: BaseUserDTOProps) {
        this._id = props._id
        this.name = props.name
        this.surname = props.surname
        this.username = props.username
        this.birthDate = props.birthDate
        this.email = props.email
        this.uid = props.uid
        this.imgUrl = props.imgUrl
        this.userType = props.userType
        this.following = props.following || []
        this.library = props.library || []
        this.listeningHistory = props.listeningHistory || []
        this.addresses = props.addresses || []
    }

    toJson(): BaseUserDTOProps {
        return {
            _id: this._id,
            name: this.name,
            surname: this.surname,
            username: this.username,
            birthDate: this.birthDate,
            email: this.email,
            uid: this.uid,
            imgUrl: this.imgUrl,
            userType: this.userType,
            following: this.following,
            library: this.library,
            listeningHistory: this.listeningHistory,
            addresses: this.addresses
        }
    }

    static fromDocument(doc: IBaseUser) {
        return new BaseUserDTO({
            _id: doc._id.toString(),
            name: doc.name,
            surname: doc.surname,
            username: doc.username,
            birthDate: doc.birthDate,
            email: doc.email,
            uid: doc.uid,
            imgUrl: doc.imgUrl,
            userType: doc.userType,
            following: doc.following.map(artist => artist.toString()),
            library: doc.library.map(product => product.toString()),
            listeningHistory: doc.listeningHistory.map(song => song.toString()),
            addresses: doc.addresses
        })
    }

}