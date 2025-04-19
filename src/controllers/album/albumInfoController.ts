import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const albumInfoController = async (req: express.Request, res: express.Response) => {
    const { albumId } = req.body
    try {
        if (!albumId) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }

        const albumDAO = req.db!.createAlbumDAO()
        const songDAO = req.db!.createSongDAO()
        const artistDAO = req.db!.createArtistDAO()
        const genreDAO = req.db!.createGenreDAO()
        const album = await albumDAO.findById(albumId)

        if (!album) {
            return res.status(Number(apiErrorCodes[3001].httpCode)).json({
                error: {
                    code: 3001,
                    message: apiErrorCodes[3001].message
                }
            })
        }

        const artist = await artistDAO.findById(album.author)
        const genres = await Promise.all(album.genres.map(async (genreId) => {
            const genreDoc = await genreDAO.findById(genreId)
            return genreDoc!.genre
        }))
        const trackList = await Promise.all(album.trackList.map(async (trackId) => {
            const song = await songDAO.findById(trackId)
            if (!song) throw new Error()
            return {
                _id: song._id!,
                title: song.title,
                duration: song.duration,
                imgUrl: song.imgUrl
            }
        }))

        const response = {
            album: {
                ...album,
                trackList,
                author: {
                    _id: artist!._id,
                    artistName: artist!.artistName,
                    artistImgUrl: artist!.artistImgUrl,
                    artistUsername: artist!.artistUsername,
                    followers: artist!.followerCount
                },
                genres,
                productType: undefined,
                ratings: undefined,
                versionHistory: undefined
            }
        }

        res.json({
            data: response
        })
    } catch {
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
}