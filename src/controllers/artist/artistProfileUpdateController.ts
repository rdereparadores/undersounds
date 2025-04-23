import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const artistProfileUpdateController = async (req: express.Request, res: express.Response) => {
    const { artistUsername, artistName } = req.body
    try {
        const artistDAO = req.db!.createArtistDAO()
        const artist = await artistDAO.findByUid(req.uid!)

        if (artistName) artist!.artistName = artistName
        if (artistUsername) artist!.artistUsername = artistUsername

        const updatedArtist = await artistDAO.update(artist!)
        if (!updatedArtist) throw new Error()

        return res.json({
            data: {
                message: 'OK'
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
