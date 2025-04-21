import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import { SongDTO, SongDTOProps } from '../../dto/SongDTO'
import { uploadSongFiles } from '../../utils/uploadSongFiles'
import mm from 'music-metadata'

export const artistReleaseSongController = async (req: express.Request, res: express.Response) => {
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
            const { title, description, priceDigital, priceCd, priceVinyl, priceCassette, collaborators, genres } = req.body
            if (!title || !description || !priceDigital || !priceCd || !priceVinyl || !priceCassette || !genres) throw new Error()

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
                const collaboratorsSplitted: string[] = collaborators.split(',')
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

            const song = new SongDTO({
                title,
                releaseDate: new Date(),
                description,
                imgUrl: '/public/uploads/song/cover/' + files.img[0].filename,
                productType: 'song',
                author: artist!._id!.toString(),
                duration: duration,
                pricing: {
                    cd: Number(priceCd),
                    digital: Number(priceDigital),
                    cassette: Number(priceCassette),
                    vinyl: Number(priceVinyl)
                },
                ratings: [],
                songDir: 'protected/song/' + files.song[0].filename,
                
                plays: 0,
                genres: genreIds,
                collaborators: collaboratorList.length === 0 ? [] : collaboratorList,
                versionHistory: []
            })

            const songDAO = req.db?.createSongDAO()
            const songDoc = await songDAO?.create(song)

            return res.json({
                data: {
                    id: songDoc?._id
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