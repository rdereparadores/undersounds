import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import mm from 'music-metadata'
import { AlbumDTO } from '../../dto/AlbumDTO'
import { uploadAlbumImage } from '../../utils/uploadAlbumImage'
import { SongDAO } from '../../dao/SongDAO'

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

        const { title, description, priceDigital, priceCd, priceVinyl, priceCassette, songArray, genres, albumId } = req.body
        if (!albumId) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }
        try {
            /*if (!req.files || Number(req.files.length) < 1) {
                return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                    error: {
                        code: 3000,
                        message: apiErrorCodes[3000].message
                    }
                })
            }*/

            const artistDAO = req.db!.createArtistDAO()
            const genreDAO = req.db!.createGenreDAO()
            const albumDAO = req.db!.createAlbumDAO()
            const songDAO = req.db!.createSongDAO()

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

            if (songArray) {
                //Añade las canciones al array de canciones
                const songArraySplitted: string[] = songArray.split(',')
                const genreList: string[] = []
                var duration: number = 0

                album.trackList = await Promise.all(songArraySplitted.map(async (song: string) => {
                    const tracklistDoc = await songDAO.findById(song)
                    if (tracklistDoc === null) throw new Error()
                    tracklistDoc.genres.forEach((g) => {
                        if (!genreList.includes(g)) {
                            genreList.push(g)
                        }
                    })
                    duration = duration + tracklistDoc.duration
                    return tracklistDoc._id!
                }))

                album.duration = Math.round(duration)
                album.genres = genreList
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

        } catch (err) {
            return res.status(Number(apiErrorCodes[2000].httpCode)).json({
                error: {
                    code: 2000,
                    message: apiErrorCodes[2000].message
                }
            })
        }
    })
}