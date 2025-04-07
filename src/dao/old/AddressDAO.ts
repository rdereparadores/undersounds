import { BaseUser, IBaseUser } from "../models/BaseUser"; // Asegúrate de ajustar la ruta según tu estructura
import { AddressDTO } from "../dto/BaseUserDTO"

export class AddressDAO {
    // Añade una nueva dirección al usuario o artista identificado por userId
    async addAddress(userId: string, address: AddressDTO): Promise<IBaseUser | null> {
        return BaseUser.findByIdAndUpdate(
            userId,
            { $push: { addresses: address } },
            { new: true }
        );
    }

    // Actualiza una dirección existente
    async updateAddress(userId: string, addressId: string, updatedData: Partial<AddressDTO>): Promise<IBaseUser | null> {
        return BaseUser.findOneAndUpdate(
            { _id: userId, "addresses._id": addressId },
            { $set: { "addresses.$": updatedData } },
            { new: true }
        );
    }

    // Elimina una dirección específica del usuario o artista
    async deleteAddress(userId: string, addressId: string): Promise<IBaseUser | null> {
        return BaseUser.findByIdAndUpdate(
            userId,
            { $pull: { addresses: { _id: addressId } } },
            { new: true }
        );
    }
}