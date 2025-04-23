import express from 'express'
import apiErrorCodes from '../utils/apiErrorCodes.json'

export const checkArtistMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const artistDAO = req.db?.createArtistDAO()
    const checkArtist = artistDAO?.findByUid(req.uid!)
    if (!checkArtist) {
        return res.status(Number(apiErrorCodes[1001].httpCode)).json({
            error: {
                code: 1001,
                message: apiErrorCodes[1001].message
            }
        })
    }
    next()
}