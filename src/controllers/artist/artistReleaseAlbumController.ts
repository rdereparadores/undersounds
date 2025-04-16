import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import mm from 'music-metadata'
import { AlbumDTO } from '../../dto/AlbumDTO'
import { uploadAlbumFiles } from '../../utils/uploadAlbumFiles'
import { SongDAO } from '../../dao/SongDAO'

export const artistReleaseAlbumController = async (req: express.Request, res: express.Response) => {
    uploadAlbumFiles(req, res, async (err) => {
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
            const { title, description, priceDigital, priceCd, priceVinyl, priceCassette, collaborators, genres, songs } = req.body
            if (!title || !description || !priceDigital || !priceCd || !priceVinyl || !priceCassette || !genres || !songs) throw new Error()

            const artistDAO = req.db!.createArtistDAO()
            const genreDAO = req.db!.createGenreDAO()

            const genresSplitted: string[] = genres.split(',')
            const genreIds = await Promise.all(genresSplitted.map(async (genreName: string) => {
                const genre = await genreDAO.findByGenre(genreName)
                if (genre === null) throw new Error()
                return genre._id!
            }))

            let collaboratorList: { accepted: boolean, artist: string }[] = []
            if (collaborators) {
                const collaboratorsSplitted: string[] = genres.split(',')
                collaboratorList = await Promise.all(collaboratorsSplitted.map(async (collaborator: string) => {
                    const collaboratorDoc = await artistDAO.findByArtistUsername(collaborator)
                    if (collaboratorDoc === null) throw new Error()
                    return { accepted: false, artist: collaboratorDoc._id! }
                }))
            }

            const files = req.files as { [fieldname: string]: Express.Multer.File[] }

            const artist = await artistDAO.findByUid(req.uid!)

            const metadata = await mm.parseFile(files.song[0].path)
            const duration = metadata.format.duration || 0

            const songDAO = req.db!.createSongDAO()

            const songSplitted: string[] = songs.split(',')
            const songArray = await Promise.all(songSplitted.map(async (songID: string) => {
                const song = await songDAO.findById(songID)
                if (song === null) throw new Error()
                return song._id!
            }))

            const album = new AlbumDTO({
                title,
                releaseDate: new Date(),
                description,
                imgUrl: '/public/uploads/album/cover/' + files.img[0].filename,
                productType: 'album',
                author: artist!._id!.toString(),
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

            const albumDAO = req.db?.createAlbumDAO()
            const albumDoc = await albumDAO?.create(album)

            return res.json({
                data: {
                    id: albumDoc?._id
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