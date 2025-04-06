import { BaseUserDTO, BaseUserDTOProps } from "./BaseUserDTO";

export interface UserDTOProps extends BaseUserDTOProps{

}

export class UserDTO extends BaseUserDTO implements UserDTOProps{
    constructor(props: UserDTOProps) {
        super(props)
    }

    override toJson(): UserDTOProps {
        return {
            ...super.toJson()
        }
    }
}