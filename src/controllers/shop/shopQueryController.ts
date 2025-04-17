import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

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
        const productDAO = req.db!.createProductDAO()

        const genresSplitted: string[] = date ? genres.split(',') : []
        const genresDocs = await Promise.all(genresSplitted.map(async (genre: string) => await genreDAO.findByGenre(genre)))
        const genresFiltered = genresDocs.filter(genre => genre !== null)

        const response = await productDAO.findWithFilters(page, limit, query, genresFiltered, date, sortBy)

        res.json({
            data: response
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