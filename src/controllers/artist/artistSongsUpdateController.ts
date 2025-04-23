import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import { SongDTO, SongDTOProps } from '../../dto/SongDTO'
import { uploadSongFiles } from '../../utils/uploadSongFiles'
import mm from 'music-metadata'

export const artistSongsUpdateController = async (req: express.Request, res: express.Response) => {
    //console.log("intento actualizar una canción")
    uploadSongFiles(req, res, async (err) => {
        if (err) {
            return res.status(Number(apiErrorCodes[3002].httpCode)).json({
                error: {
                    code: 3002,
                    message: apiErrorCodes[3002].message
                }
            })
        }
        //console.log("Sigo1")
        try {
            if (!req.files || Number(req.files.length) < 2) {
                return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                    error: {
                        code: 3000,
                        message: apiErrorCodes[3000].message
                    }
                })
            }
            const { title, description, priceDigital, priceCd, priceVinyl, priceCassette, collaborators, genres, id } = req.body
            if (!title || !description || !priceDigital || !priceCd || !priceVinyl || !priceCassette || !genres || !id) {
                console.log("He fallado en algun campo")
                throw new Error()
            }

            //console.log("los datos llegados son: " + title + " , " + description + " , " + id)

            //console.log("sigo2")
            const artistDAO = req.db!.createArtistDAO()
            const genreDAO = req.db!.createGenreDAO()

            //console.log("Sigo3")
            const genresSplitted: string[] = genres.split(',')
            const genreIds = await Promise.all(genresSplitted.map(async (genreName: string) => {
                const genre = await genreDAO.findByGenre(genreName)
                if (genre === null) throw new Error()
                return genre._id!
            }))

            //console.log("Sigo4")
            //TODO arreglar con los que pone por defecto
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

            //Guardo la version antigua para añadirla luego
            const songDAOVieja = req.db?.createSongDAO()
            const songDTOVieja = await songDAOVieja?.findById(id)
            //console.log("Tengo la version antigua: " + songDTOVieja?._id + " , " + songDTOVieja?.versionHistory)

            const songDTONueva = new SongDTO({
                title: title,
                releaseDate: new Date(),
                description: description,
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
                versionHistory: songDTOVieja?.versionHistory
            })

            const songDAONueva = req.db?.createSongDAO()
            const songDocNueva = await songDAONueva?.create(songDTONueva)
            //console.log("Tengo la version nueva con el array de la antigua: " + songDTONueva?._id + " , " + songDTONueva?.versionHistory)


            if (songDocNueva === undefined || songDTOVieja === undefined) {
                console.log(songDTONueva)
                console.log(songDTOVieja)
                return
            }

            if (songDocNueva === null || songDTOVieja === null) {
                console.log(songDTONueva)
                console.log(songDTOVieja)
                return
            }

            //Añado la canción vieja a su array de versiones
            await songDAONueva?.addToVersionHistory(songDocNueva, songDTOVieja)
            //console.log("Se ha añadido la canción al historia de versiones: " )
            //console.log(songDocNueva._id)
            return res.json({
                data: {
                    id: songDocNueva?._id
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