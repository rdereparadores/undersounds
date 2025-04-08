import { Schema } from "mongoose";
import { BaseUser, BaseUserSchema, IBaseUser } from "./BaseUser";

const UserSchema = new Schema({
})

export const User = BaseUser.discriminator<IBaseUser>('user', UserSchema)