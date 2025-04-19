import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userFeaturedArtistsController = async (req: express.Request, res: express.Response) => {
    try {
        //const userDAO = req.db!.createBaseUserDAO()
        const artistDAO = req.db!.createArtistDAO()

        //const user = await userDAO.findByUid(req.uid!)
        // TEMPORAL: Sólo devuelve artistas aleatorios
        const allArtists = await artistDAO.getAll()
        const allArtistsShorted = allArtists.slice(0, 4).map(artist => ({
            name: artist.name,
            imgUrl: artist.artistImgUrl
        }))

        return res.json({
            data: allArtistsShorted
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
