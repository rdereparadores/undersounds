import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const trendingSongsController = async (req: express.Request, res: express.Response) => {
    try {
        const songDAO = req.db!.createSongDAO()

        const trendingSongs = await songDAO.findMostPlayed(10)

        res.json({
            data: {
                songs: trendingSongs
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
}