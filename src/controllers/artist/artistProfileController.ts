import { Request, Response } from 'express'

export const artistProfileController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const artistDAO = req.db!.createArtistDAO()
        const artist = await artistDAO.findByUid(req.body.uid)

        return res.json({
            data: {
                name: artist?.name,
                surName: artist?.sur_name,
                birthDate: artist?.birth_date,
                userName: artist?.user_name,
                email: artist?.email,
                imgUrl: artist?.img_url,
                artistName: artist?.artist_name,
                artistUserName: artist?.artist_user_name
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
