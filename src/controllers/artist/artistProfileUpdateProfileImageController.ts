import express from 'express'
import { uploadArtistProfileImage } from '../../utils/uploadArtistProfileImage'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const artistProfileUpdateProfileImageController = async (req: express.Request, res: express.Response) => {
    uploadArtistProfileImage(req, res, async (err) => {
        if (err) {
            return res.status(Number(apiErrorCodes[3002].httpCode)).json({
                error: {
                    code: 3002,
                    message: apiErrorCodes[3002].message
                }
            })
        }

        try {
            if (!req.file) {
                return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                    error: {
                        code: 3000,
                        message: apiErrorCodes[3000].message
                    }
                })
            }

            const imgUrl = '/public/uploads/artist/profile/' + req.file.filename
            const artistDAO = req.db!.createArtistDAO()
            const artist = await artistDAO.findByUid(req.uid!)
            artist!.artist_img_url = imgUrl
            await artistDAO.update(artist!)

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
    })
}