import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import mm from 'music-metadata'
import { AlbumDTO } from '../../dto/AlbumDTO'
import { uploadAlbumImage } from '../../utils/uploadAlbumImage'

export const artistAlbumsUpdateController = async (req: express.Request, res: express.Response) => {
    uploadAlbumImage(req, res, async (err) => {
        if (err) {
            return res.status(Number(apiErrorCodes[3002].httpCode)).json({
                error: {
                    code: 3002,
                    message: apiErrorCodes[3002].message
                }
            })
        }

        const { title, description, priceDigital, priceCd, priceVinyl, priceCassette, songsArray,genres ,albumId } = req.body
        if (!albumId) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }
        try {
            if (!req.files || Number(req.files.length) < 1) {
                return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                    error: {
                        code: 3000,
                        message: apiErrorCodes[3000].message
                    }
                })
            }

            const artistDAO = req.db!.createArtistDAO()
            const genreDAO = req.db!.createGenreDAO()
            const albumDAO = req.db!.createAlbumDAO()

            const album = await albumDAO.findById(albumId)
            const oldAlbum = await albumDAO.findById(albumId)

            if (!album) throw new Error()

            if (title) {
                album.title = title
            }

            if (description) {
                album.description = description
            }

            if (priceDigital) {
                album.pricing.digital = Number(priceDigital)
            }

            if (priceCassette) {
                album.pricing.cassette = Number(priceCassette)
            }

            if (priceCd) {
                album.pricing.cd = Number(priceCd)
            }

            if (priceVinyl) {
                album.pricing.vinyl = Number(priceVinyl)
            }

            if(songsArray){
                album.trackList = songsArray
            }

            const files = req.files as { [fieldname: string]: Express.Multer.File[] }

            if (files.albumImage) {
                album.imgUrl = '/public/uploads/album/cover/' + files.albumImage[0].filename
            }

            oldAlbum!._id = undefined
            oldAlbum!.versionHistory = []
            oldAlbum!.version = album.versionHistory!.length
            const result = await albumDAO.create(oldAlbum!)
            album.versionHistory!.push(result._id!)
            await albumDAO.update(album)
            
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