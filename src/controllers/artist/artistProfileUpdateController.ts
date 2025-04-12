import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const artistProfileUpdateController = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    try {

        const { artistUsername, artistName } = req.body

        const artistDAO = req.db!.createArtistDAO()
        const artist = await artistDAO.findByUid(req.uid!)

        if (artistName) artist!.artist_name = artistName
        if (artistUsername) artist!.artist_user_name = artistUsername

        await artistDAO.update(artist!)

        return res.json({
            data: {
                message: 'OK'
            }
        });
    } catch {
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
};
