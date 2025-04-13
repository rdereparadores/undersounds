import express from 'express'
import { uploadArtistBannerImage } from '../../utils/uploadArtistBannerImage'

export const artistProfileUpdateBannerImageController = async (req: express.Request, res: express.Response) => {
    uploadArtistBannerImage(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                error: {
                    code: 2000,
                    message: 'Error al subir el archivo de imagen'
                }
            })
        }
        
        try {
            if (!req.file) {
                return res.status(400).json({
                    error: {
                        code: 2001,
                        message: 'Ninguna imagen subida'
                    }
                })
            }

            const imgUrl = '/public/uploads/artist/banner/' + req.file.filename
            const artistDAO = req.db!.createArtistDAO()
            const artist = await artistDAO.findByUid(req.uid!)
            artist!.artist_banner_img_url = imgUrl
            await artistDAO.update(artist!)

            return res.json({
                data: {
                    message: 'OK'
                }
            })
        } catch {
            return res.status(500).json({
                error: {
                    code: 3000,
                    message: 'Error obteniendo la información'
                }
            })
        }
    })
}