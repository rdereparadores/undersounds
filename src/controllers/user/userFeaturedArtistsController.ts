import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userFeaturedArtistsController = async (req: express.Request, res: express.Response) => {
    try {
        const artistDAO = req.db!.createArtistDAO()
        const userDAO = req.db!.createBaseUserDAO()
        const user = await userDAO.findByUid(req.uid!)

        const allArtists = await artistDAO.getAll()
        const allArtistsFiltered = allArtists.filter(artist => !user!.following.includes(artist._id!) && artist._id! != user!._id).slice(0, 4).map(artist => ({
            imgUrl: artist.imgUrl,
            artistUsername: artist.artistUsername,
            artistName: artist.artistName
        }))

        return res.json({
            data: allArtistsFiltered
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
