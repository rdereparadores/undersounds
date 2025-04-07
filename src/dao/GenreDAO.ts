import { GenreDTO } from "../dto/GenreDTO";
import { Genre, IGenre } from "../models/Genre";

export interface IGenreDAO {
    create(dto: GenreDTO): Promise<GenreDTO>

    findById(_id: string): Promise<GenreDTO | null>

    findByGenre(genre: string): Promise<GenreDTO | null>

    getAll(): Promise<GenreDTO[]>

    update(dto: GenreDTO): Promise<GenreDTO | null>

    delete(dto: GenreDTO): Promise<boolean>
}

export class GenreDAO implements IGenreDAO {
    constructor() {

    }

    async create(dto: GenreDTO): Promise<GenreDTO> {
        const newGenre = await Genre.create({ genre: dto.genre }) as IGenre
        return GenreDTO.fromDocument(newGenre)
    }

    async findById(_id: string): Promise<GenreDTO | null> {
        const genre = await Genre.findById(_id)
        if (!genre) return null

        return GenreDTO.fromDocument(genre)
    }

    async findByGenre(genre: string): Promise<GenreDTO | null> {
        const genreDoc = await Genre.findOne({ genre })
        if (!genreDoc) return null

        return GenreDTO.fromDocument(genreDoc)
    }

    async getAll(): Promise<GenreDTO[]> {
        const genres = await Genre.find()
        return genres.map(genre => GenreDTO.fromDocument(genre))
    }

    async update(dto: GenreDTO): Promise<GenreDTO | null> {
        const updatedGenre = await Genre.findByIdAndUpdate(
            dto._id,
            { genre: dto.genre },
            { new: true }
        )

        if (!updatedGenre) return null

        return GenreDTO.fromDocument(updatedGenre)
    }

    async delete(dto: GenreDTO): Promise<boolean> {
        const result = await Genre.findByIdAndDelete(dto._id)
        return result !== null
    }
}