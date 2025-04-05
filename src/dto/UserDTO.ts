
export interface AddressProps {
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
    observations?: string
}

export interface UserDTOProps {
    _id: string,
    name: string,
    sur_name: string,
    birth_date: Date,
    email: string,
    uid: string,
    img_url: string,
    addresses: AddressProps[]
}

export class UserDTO {
    _id!: string
    name!: string
    sur_name!: string
    birth_date!: Date
    email!: string
    uid!: string
    img_url!: string
    addresses!: AddressProps[]

    constructor(props: UserDTOProps) {
        Object.assign(this, props)
    }

    toJson() {
        return {
            ...this
        }
    }
}