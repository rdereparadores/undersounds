import { UserDTO } from "../dto/UserDTO"
import { User } from "../models/User"
import { BaseUserDAO, IBaseUserDAO } from "./BaseUserDAO"

export interface IUserDAO extends IBaseUserDAO {
    create(user: UserDTO): Promise<UserDTO>

    findById(_id: string): Promise<UserDTO | null>
    findByUsername(username: string): Promise<UserDTO | null>
    findByEmail(email: string): Promise<UserDTO | null>
    findByUid(uid: string): Promise<UserDTO | null>

    getAll(): Promise<UserDTO[]>
}

export class UserDAO extends BaseUserDAO implements IUserDAO {
    constructor() { super() }

    async create(user: UserDTO): Promise<UserDTO> {
        const newUser = await User.create(user)
        return UserDTO.fromDocument(newUser)
    }

    async findById(_id: string): Promise<UserDTO | null> {
        const user = await User.findById(_id)
        if (user === null) return null

        return UserDTO.fromDocument(user)
    }

    async findByUsername(username: string): Promise<UserDTO | null> {
        const user = await User.findOne({ username })
        if (user === null) return null

        return UserDTO.fromDocument(user)
    }

    async findByEmail(email: string): Promise<UserDTO | null> {
        const user = await User.findOne({ email })
        if (user === null) return null

        return UserDTO.fromDocument(user)
    }

    async findByUid(uid: string): Promise<UserDTO | null> {
        const user = await User.findOne({ uid })
        if (user === null) return null

        return UserDTO.fromDocument(user)
    }

    async getAll(): Promise<UserDTO[]> {
        const users = await User.find()
        return users.map(user => UserDTO.fromDocument(user))
    }
}