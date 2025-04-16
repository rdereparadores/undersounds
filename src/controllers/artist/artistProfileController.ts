import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const artistProfileController = async (req: express.Request, res: express.Response) => {
    try {
        const artistDAO = req.db!.createArtistDAO()
        const artist = await artistDAO.findByUid(req.uid!)

        return res.json({
            data: {
                artistName: artist!.artistName,
                artistUsername: artist!.artistUsername,
                artistImgUrl: artist!.artistImgUrl,
                artistBannerUrl: artist!.artistBannerUrl
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
