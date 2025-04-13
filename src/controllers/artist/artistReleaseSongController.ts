import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import { SongDTO, SongDTOProps } from '../../dto/SongDTO'
import { uploadSongFiles } from '../../utils/uploadSongFiles'

// TODO: REVISAR Y AÑADIR COLABORADORES Y GENEROS
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
            const files = req.files as { [fieldname: string]: Express.Multer.File[] }
            const artistDAO = req.db!.createArtistDAO()
            const artist = await artistDAO.findByUid(req.uid!)

            /*const collaboratorsDoc = collaborators.split(',').map(async (collaborator: string) => {
                const collDoc = await artistDAO.findByArtistUsername(collaborator)
                return { accepted: false, artist: collDoc!._id }
            })*/

            const song = new SongDTO({
                title,
                release_date: new Date(),
                description,
                img_url: '/public/uploads/song/cover/' + files.img[0].filename,
                product_type: 'song',
                author: artist!._id!.toString(),
                pricing: {
                    cd: Number(priceCd),
                    digital: Number(priceDigital),
                    cassette: Number(priceCassette),
                    vinyl: Number(priceVinyl)
                },
                ratings: [],
                song_dir: '/protected/song/' + files.song[0].filename,
                duration: 0,
                plays: 0,
                genres: [], // Cambiarlo a IDs de géneros
                collaborators: [],
                version_history: []
            })

            const songDAO = req.db?.createSongDAO()
            const songDoc = await songDAO?.create(song)

            return res.json({
                data: {
                    id: songDoc?._id
                }
            })

        } catch (error) {
            console.log(error)
            return res.status(Number(apiErrorCodes[2000].httpCode)).json({
                error: {
                    code: 2000,
                    message: apiErrorCodes[2000].message
                }
            })
        }
    })
}