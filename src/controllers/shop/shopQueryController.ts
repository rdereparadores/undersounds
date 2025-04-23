import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import { SongDTO } from '../../dto/SongDTO';
import { GenreDTO } from '../../dto/GenreDTO';
import { ArtistDTO } from '../../dto/ArtistDTO';

export const shopQueryController = async (req: express.Request, res: express.Response) => {
    try {
        const {
            page = 1,
            genres = [],
            date,
            sortBy,
            query
        } = req.body

        const limit = 20

        const genreDAO = req.db!.createGenreDAO()
        const artistDAO = req.db!.createArtistDAO()
        const productDAO = req.db!.createProductDAO()

        const genresDocs: GenreDTO[] = await Promise.all(genres.map(async (genre: string) => await genreDAO.findByGenre(genre)))

        const result = await productDAO.findWithFilters(page, limit, query, genresDocs, date, sortBy)

        const responsePopulated = await Promise.all(result.products.map(async (product) => {
            const genres = await Promise.all(product.genres.map(async (genre: string) => await genreDAO.findById(genre)))
            const author = await artistDAO.findById(product.author)
            // TEMPORAL, AÑADIR CAMPO COLLABORATORS A ALBUM PARA Q VAYA
            let collaborators: ArtistDTO[] = []
            return {
                ...product,
                author,
                genres,
                collaborators
            }
        }))
        const response = responsePopulated.map(item => ({
            _id: item._id!,
            imgUrl: item.imgUrl,
            title: item.title,
            author: {
                _id: item.author!._id!,
                artistName: item.author!.artistName
            },
            collaborators: item.collaborators.map(c => ({
                _id: c._id!,
                artistName: c.artistName
            })),
            type: item.productType,
            genres: item.genres.map(genre => genre!.genre)
        }))

        res.json({
            data: {
                products: response,
                totalCount: result.totalCount
            }
        })
    } catch {
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
};