import { Request, Response } from 'express'

export const artistProfileController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const artistDAO = req.db!.createArtistDAO()
        const artist = await artistDAO.findByUid(req.body.uid)

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
        return res.status(500).json({
            error: {
                code: 3000,
                message: 'Error obteniendo la información'
            }
        });
    }
};
