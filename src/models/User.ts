import { BaseUser, BaseUserSchema, IBaseUser } from "./BaseUser";

export const User = BaseUser.discriminator<IBaseUser>('user', BaseUserSchema)