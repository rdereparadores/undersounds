import express from 'express'

export const checkArtistMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const artistDAO = req.db?.createArtistDAO()
    const checkArtist = artistDAO?.findByUid(req.uid!)
    if (!checkArtist) {
        res.status(401).send({
            error: {
                code: 1000,
                message: 'USER_IS_NOT_ARTIST'
            }
        })
    }
    next()
}