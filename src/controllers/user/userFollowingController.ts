import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userFollowingController = async (req: express.Request, res: express.Response) => {
    try {
        const userDAO = req.db!.createBaseUserDAO()
        const artistDAO = req.db!.createArtistDAO()
        const user = await userDAO.findByUid(req.uid!)

        const following = await Promise.all(user!.following.map(async (id) => {
            const artist = await artistDAO.findById(id)
            return {
                imgUrl: artist!.artistImgUrl,
                artistName: artist!.artistName,
                artistUsername: artist!.artistUsername
            }
        }))

        return res.json({
            data: following
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