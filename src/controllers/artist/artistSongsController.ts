import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const artistSongsController = async (req: express.Request, res: express.Response) => {
    try {
        const artistDAO = req.db!.createArtistDAO()
        const songDAO = req.db!.createSongDAO()
        const artist = await artistDAO.findByUid(req.uid!)
        const songs = (await songDAO.findByArtist({ _id: artist!._id })).filter((cancion) => cancion.version === undefined)

        console.log(songs)
        return res.json({
            data: songs
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