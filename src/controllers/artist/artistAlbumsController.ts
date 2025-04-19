import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const artistAlbumsController = async (req: express.Request, res: express.Response) => {
    try {
        const artistDAO = req.db!.createArtistDAO()
        const albumDAO = req.db!.createAlbumDAO()
        const artist = await artistDAO.findByUid(req.uid!)
        const albums = await albumDAO.findByArtist({ _id: artist!._id })

        return res.json({
            data: albums
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