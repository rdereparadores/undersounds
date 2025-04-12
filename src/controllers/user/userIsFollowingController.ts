import { Request, Response } from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userIsFollowingController = async (req: Request, res: Response) => {
    try {
        const { artistUsername } = req.body()

        if (!artistUsername) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }

        const userDAO = req.db!.createBaseUserDAO()
        const artistDAO = req.db!.createArtistDAO()
        const user = await userDAO.findByUid(req.uid!)
        const artist = await artistDAO.findByArtistUsername(artistUsername)

        return res.json({
            data: {
                following: user?.following.includes(artist?._id!)
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