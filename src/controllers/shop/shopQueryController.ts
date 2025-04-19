import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import { SongDTO } from '../../dto/SongDTO';

export const shopQueryController = async (req: express.Request, res: express.Response) => {
    try {
        const {
            page = 1,
            genres,
            date,
            sortBy,
            query
        } = req.body
        console.log(genres)

        const limit = 20

        const genreDAO = req.db!.createGenreDAO()
        const artistDAO = req.db!.createArtistDAO()
        const productDAO = req.db!.createProductDAO()

        const genresSplitted: string[] = genres ? genres.split(',') : []
        const genresDocs = await Promise.all(genresSplitted.map(async (genre: string) => await genreDAO.findByGenre(genre)))
        const genresFiltered = genresDocs.filter(genre => genre !== null)

        const response = await productDAO.findWithFilters(page, limit, query, genresFiltered, date, sortBy)
        const responsePopulated = await Promise.all(response.products.map(async (product) => {
            if (!(product instanceof SongDTO)) return product
            const genreNames = await Promise.all(product.genres.map(async (genre: string) => await genreDAO.findById(genre)))
            const authorDoc = await artistDAO.findById(product.author)
            return {
                ...product,
                author: authorDoc!.artistName,
                genres: genreNames.map(genre => genre?.genre)
            }
        }))

        res.json({
            data: {
                products: responsePopulated,
                totalCount: response.totalCount
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