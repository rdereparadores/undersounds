import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const artistProfileController = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    try {
        const artistDAO = req.db!.createArtistDAO()
        const artist = await artistDAO.findByUid(req.uid!)

        return res.json({
            data: {
                name: artist?.name,
                surname: artist?.sur_name,
                birthDate: artist?.birth_date,
                username: artist?.user_name,
                email: artist?.email,
                imgUrl: artist?.img_url,
                artistName: artist?.artist_name,
                artistUsername: artist?.artist_user_name,
                artistImgUrl: artist?.artist_img_url,
                artistBannerImgUrl: artist?.artist_banner_img_url
            }
        })

    } catch (error) {
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
}
