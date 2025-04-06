import { Model, Document } from "mongoose";
import { UserDTO, UserDTOProps } from "../dto/UserDTO";

export class UserDAO {
    private model: Model<Document>;

    constructor(model: Model<Document>) {
        this.model = model;
    }

    // Crea un usuario nuevo
    async create(userProps: UserDTOProps): Promise<UserDTO> {
        const createdUser = await this.model.create(userProps);
        return new UserDTO(createdUser.toObject());
    }

    // Busca un usuario por su ID
    async findById(id: string): Promise<UserDTO | null> {
        const user = await this.model.findById(id);
        return user ? new UserDTO(user.toObject()) : null;
    }

    // Actualiza un usuario parcialmente
    async update(id: string, userProps: Partial<UserDTOProps>): Promise<UserDTO | null> {
        const updatedUser = await this.model.findByIdAndUpdate(id, userProps, { new: true });
        return updatedUser ? new UserDTO(updatedUser.toObject()) : null;
    }

    // Elimina un usuario por su ID
    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id);
        return result !== null;
    }

    // Permite a un usuario seguir a un artista
    async followArtist(userId: string, artistId: string): Promise<UserDTO | null> {
        const updatedUser = await this.model.findByIdAndUpdate(
            userId,
            { $addToSet: { following: artistId } },
            { new: true }
        );
        return updatedUser ? new UserDTO(updatedUser.toObject()) : null;
    }

    // Permite a un usuario dejar de seguir a un artista
    async unfollowArtist(userId: string, artistId: string): Promise<UserDTO | null> {
        const updatedUser = await this.model.findByIdAndUpdate(
            userId,
            { $pull: { following: artistId } },
            { new: true }
        );
        return updatedUser ? new UserDTO(updatedUser.toObject()) : null;
    }
}
