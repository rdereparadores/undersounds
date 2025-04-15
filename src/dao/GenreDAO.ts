import { GenreDTO } from "../dto/GenreDTO";
import { Genre } from "../models/Genre";

export interface IGenreDAO {
    create(genre: GenreDTO): Promise<GenreDTO>

    findById(_id: string): Promise<GenreDTO | null>
    findByGenre(genre: string): Promise<GenreDTO | null>

    getAll(): Promise<GenreDTO[]>

    update(genre: Partial<GenreDTO>): Promise<boolean>

    delete(genre: Partial<GenreDTO>): Promise<boolean>
}

export class GenreDAO implements IGenreDAO {
    constructor() {

    }

    async create(genre: GenreDTO): Promise<GenreDTO> {
        const newGenre = await Genre.create(genre)
        return GenreDTO.fromDocument(newGenre)
    }

    async findById(_id: string): Promise<GenreDTO | null> {
        const genre = await Genre.findById(_id)
        if (genre === null) return null

        return GenreDTO.fromDocument(genre)
    }

    async findByGenre(genre: string): Promise<GenreDTO | null> {
        const genreDoc = await Genre.findOne({ genre })
        if (genreDoc === null) return null

        return GenreDTO.fromDocument(genreDoc)
    }

    async getAll(): Promise<GenreDTO[]> {
        const genres = await Genre.find()
        return genres.map(genre => GenreDTO.fromDocument(genre))
    }

    async update(genre: Partial<GenreDTO>): Promise<boolean> {
        const updatedGenre = await Genre.findByIdAndUpdate(
            genre._id,
            { genre: genre.genre },
            { new: true }
        )

        return updatedGenre !== null
    }

    async delete(genre: Partial<GenreDTO>): Promise<boolean> {
        const result = await Genre.findByIdAndDelete(genre._id)
        return result !== null
    }
}