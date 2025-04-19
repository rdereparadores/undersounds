import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userUnfollowController = async (req: express.Request, res: express.Response) => {
    const { artistUsername } = req.body
    try {
        const userDAO = req.db!.createBaseUserDAO()
        const artistDAO = req.db!.createArtistDAO()

        const user = await userDAO.findByUid(req.uid!)
        const artist = await artistDAO.findByArtistUsername(artistUsername)

        if (artist === null) throw new Error()
        if (!user!.following.includes(artist._id!)) throw new Error()
        
        user!.following = user!.following.filter(follow => follow !== artist._id!)
        await userDAO.update(user!)
        artist.followerCount -= 1
        await artistDAO.update(artist)

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
}