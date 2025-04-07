import { Model, Document } from "mongoose";
import { ArtistDTO, ArtistDTOProps } from "../dto/ArtistDTO";

export class ArtistDAO {
    private model: Model<Document>;

    constructor(model: Model<Document>) {
        this.model = model;
    }

    // Crea un artista nuevo
    async create(artistProps: ArtistDTOProps): Promise<ArtistDTO> {
        const createdArtist = await this.model.create(artistProps);
        return new ArtistDTO(createdArtist.toObject());
    }

    // Busca un artista por su ID
    async findById(id: string): Promise<ArtistDTO | null> {
        const artist = await this.model.findById(id);
        return artist ? new ArtistDTO(artist.toObject()) : null;
    }

    // Actualiza un artista parcialmente
    async update(id: string, artistProps: Partial<ArtistDTOProps>): Promise<ArtistDTO | null> {
        const updatedArtist = await this.model.findByIdAndUpdate(id, artistProps, { new: true });
        return updatedArtist ? new ArtistDTO(updatedArtist.toObject()) : null;
    }

    // Elimina un artista por su ID
    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id);
        return result !== null;
    }

    // Permite buscar artistas por nombre
    async findByArtistName(name: string): Promise<ArtistDTO[]> {
        const artists = await this.model.find({ artist_name: { $regex: name, $options: "i" } });
        return artists.map(artist => new ArtistDTO(artist.toObject()));
    }

    // Recupera todos los artistas y retorna, además, el total de registros
    async findAll(): Promise<ArtistDTO[]> {
        const artists = await this.model.find({});
        return artists.map(artist => new ArtistDTO(artist.toObject()));
    }

}
