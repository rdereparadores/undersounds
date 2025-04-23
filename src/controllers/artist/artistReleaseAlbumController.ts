import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import { AlbumDTO } from '../../dto/AlbumDTO'
import { uploadAlbumImage } from '../../utils/uploadAlbumImage'

export const artistReleaseAlbumController = async (req: express.Request, res: express.Response) => {
    //console.log("intento crear un álbum: " + req.body.title)

    uploadAlbumImage(req, res, async (err) => {
        //console.log("Intento subir el archivo")
        if (err) {
            console.error("Error al subir el archivo", err)
            return res.status(Number(apiErrorCodes[3002].httpCode)).json({
                error: {
                    code: 3002,
                    message: apiErrorCodes[3002].message
                }
            })
        }
        //console.log("Sigo")
        //console.log("Archivos subidos:", req.files)
        try {
            if (!req.files) {
                console.error("Error en el numero de archivos")
                return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                    error: {
                        code: 3000,
                        message: apiErrorCodes[3000].message
                    }
                })
            }

           // console.log("sigo")
            const { title, description, priceDigital, priceCd, priceVinyl, priceCassette, songs } = req.body
            if (!title || !description || !priceDigital || !priceCd || !priceVinyl || !priceCassette  || !songs) {
                //console.log("He fallado al conseguir el body")
                //console.log(title + description + songs)
                throw new Error()
            }

            //console.log("He conseguido los valores del body")

            const artistDAO = req.db!.createArtistDAO()
            const songDAO = req.db!.createSongDAO()

            //console.log("He conseguido el artista, genero y canción")

            const songsSplitted: string[] = songs.split(',')
            //console.log("He dividido las canciones que son: " + songsSplitted)

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
            //console.log("El álbum dura: " + albumDuration)

            const genreMatrix = await Promise.all(songsSplitted.map(async (songID: string) => {
                const song = await songDAO.findById(songID)
                if (song === null) throw new Error()
                return song.genres
            }))

            const genreArray = genreMatrix.flat()

            var genreArrayUnique = genreArray.filter(function(elem, index, self) {
                return index === self.indexOf(elem);
            })
            //console.log("El album tiene los generos: " + genreArrayUnique)
            
            //console.log("He conseguido los generos y las canciones")
            const files = req.files as { [fieldname: string]: Express.Multer.File[] }

            //console.log("El artita con uid: " + req.uid)
            const artist = await artistDAO.findByUid(req.uid!)

            //console.log("Empiezo a crear el album")
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
            //console.log("album creado")

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