import { Schema } from "mongoose"
import { BaseUser, IBaseUser } from "./BaseUser"

const UserSchema = new Schema({
})

export const User = BaseUser.discriminator<IBaseUser>('user', UserSchema)