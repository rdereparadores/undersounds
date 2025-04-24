import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import { SongDTO, SongDTOProps } from '../../dto/SongDTO'
import { uploadSongFiles } from '../../utils/uploadSongFiles'
import mm from 'music-metadata'

export const artistSongsUpdateController = async (req: express.Request, res: express.Response) => {
    const { title, description, priceDigital, priceCd, priceVinyl, priceCassette, collaborators, genres, songId } = req.body
    if (!songId) {
        return res.status(Number(apiErrorCodes[3000].httpCode)).json({
            error: {
                code: 3000,
                message: apiErrorCodes[3000].message
            }
        })
    }
    uploadSongFiles(req, res, async (err) => {
        if (err) {
            return res.status(Number(apiErrorCodes[3002].httpCode)).json({
                error: {
                    code: 3002,
                    message: apiErrorCodes[3002].message
                }
            })
        }
        try {
            if (!req.files || Number(req.files.length) < 2) {
                return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                    error: {
                        code: 3000,
                        message: apiErrorCodes[3000].message
                    }
                })
            }

            const artistDAO = req.db!.createArtistDAO()
            const genreDAO = req.db!.createGenreDAO()
            const songDAO = req.db!.createSongDAO()
            
            const song = await songDAO.findById(songId)
            const oldSong = await songDAO.findById(songId)
            if (!song) throw new Error()

            if (genres) {
                const genresSplitted: string[] = genres.split(',')
                song.genres = await Promise.all(genresSplitted.map(async (genreName: string) => {
                    const genre = await genreDAO.findByGenre(genreName)
                    if (genre === null) throw new Error()
                    return genre._id!
                }))
            }

            if (title) {
                song.title = title
            }

            if (description) {
                song.description = description
            }

            if (priceDigital) {
                song.pricing.digital = Number(priceDigital)
            }

            if (priceCassette) {
                song.pricing.cassette = Number(priceCassette)
            }

            if (priceCd) {
                song.pricing.cd = Number(priceCd)
            }

            if (priceVinyl) {
                song.pricing.vinyl = Number(priceVinyl)
            }
            
            if (collaborators) {
                const collaboratorsSplitted = collaborators.split(',')
                song.collaborators = await Promise.all(collaboratorsSplitted.map(async (collaborator: string) => {
                    const collaboratorDoc = await artistDAO.findByArtistUsername(collaborator)
                    if (collaboratorDoc === null) throw new Error()
                    return { accepted: false, artist: collaboratorDoc._id! }
                }))
            }

            const files = req.files as { [fieldname: string]: Express.Multer.File[] }
            
            if (files.song[0]) {
                song.songDir = 'protected/song/' + files.song[0].filename
                const metadata = await mm.parseFile(files.song[0].path)
                song.duration = metadata.format.duration || 0
            }

            if (files.img[0]) {
                song.imgUrl = '/public/uploads/song/cover/' + files.img[0].filename
            }

            oldSong!._id = undefined
            oldSong!.versionHistory = []
            oldSong!.version = song.versionHistory!.length
            const result = await songDAO.create(oldSong!)
            song.versionHistory!.push(result._id!)
            await songDAO.update(song)

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