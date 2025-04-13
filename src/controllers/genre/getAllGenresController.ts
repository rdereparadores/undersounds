import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const genreAllController = async (req: express.Request, res: express.Response) => {
    try {
        const genreDAO = req.db!.createGenreDAO()

        const genres = await genreDAO.getAll()

        res.json({
            data: {
                genres: genres.map(genre => genre.genre)
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