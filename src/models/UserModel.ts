import { Schema } from "mongoose";
import BaseUser from "./BaseUserModel";
import { IBaseUser } from "./interfaces/IBaseUser";

const UserSchema = new Schema({
})

const User = BaseUser.discriminator<IBaseUser>('User', UserSchema);

export default User;