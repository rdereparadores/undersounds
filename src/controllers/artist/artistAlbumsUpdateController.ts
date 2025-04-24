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
        try {
            if (!req.files) {
                return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                    error: {
                        code: 3000,
                        message: apiErrorCodes[3000].message
                    }
                })
            }
            const { title, description, priceDigital, priceCd, priceVinyl, priceCassette, songs } = req.body
            if (!title || !description || !priceDigital || !priceCd || !priceVinyl || !priceCassette  || !songs) {
                throw new Error()
            }

            const artistDAO = req.db!.createArtistDAO()
            const songDAO = req.db!.createSongDAO()

            const songsSplitted: string[] = songs.split(',')

            const songArray = await Promise.all(songsSplitted.map(async (songID: string) => {
                const song = await songDAO.findById(songID)
                if (song === null) throw new Error()
                return song._id!
            }))

            const songDTOArray = await Promise.all(songsSplitted.map(async (songID: string) => {
                const song = await songDAO.findById(songID)
                if (song === null) throw new Error()
                return song
            }))

            let albumDuration = 0
            songDTOArray.forEach((song) => albumDuration = albumDuration + song.duration)

            const genreMatrix = await Promise.all(songsSplitted.map(async (songID: string) => {
                const song = await songDAO.findById(songID)
                if (song === null) throw new Error()
                return song.genres
            }))

            const genreArray = genreMatrix.flat()

            var genreArrayUnique = genreArray.filter(function(elem, index, self) {
                return index === self.indexOf(elem);
            })
            const files = req.files as { [fieldname: string]: Express.Multer.File[] }

            const artist = await artistDAO.findByUid(req.uid!)

            const album = new AlbumDTO({
                title,
                releaseDate: new Date(),
                description,
                imgUrl: '/public/uploads/album/cover/' + files.albumImage[0].filename,
                productType: 'album',
                author: artist!._id!.toString(),
                duration: albumDuration,
                genres: genreArrayUnique,
                pricing: {
                    cd: Number(priceCd),
                    digital: Number(priceDigital),
                    cassette: Number(priceCassette),
                    vinyl: Number(priceVinyl)
                },
                ratings: [],
                trackList: songArray,
                versionHistory: []
            })

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