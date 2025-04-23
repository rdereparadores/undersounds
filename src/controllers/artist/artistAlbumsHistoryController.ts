import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const artistAlbumsHistoryController = async (req: express.Request, res: express.Response) => {
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
        const artistDAO = req.db!.createArtistDAO()
        const albumDAO = req.db!.createAlbumDAO()
        const songDAO = req.db!.createSongDAO()
        const genreDAO = req.db!.createGenreDAO()
        const artist = await artistDAO.findByUid(req.uid!)
        const album = await albumDAO.findById(albumId)

        if (!album) {
            return res.status(Number(apiErrorCodes[3001].httpCode)).json({
                error: {
                    code: 3001,
                    message: apiErrorCodes[3001].message
                }
            })
        }

        if (album.author != artist?._id!) {
            return res.status(Number(apiErrorCodes[1003].httpCode)).json({
                error: {
                    code: 1003,
                    message: apiErrorCodes[1003].message
                }
            })
        }

        const history = await Promise.all(album.versionHistory!.map(async (version) => {
            const album = await albumDAO.findById(version)
            const genres = await Promise.all(album!.genres.map(async (genre) => await genreDAO.findById(genre)))
            const trackList = await Promise.all(album!.trackList.map(async (track) => {
                const song = await songDAO.findById(track)
                const collaborators = await Promise.all(song!.collaborators.map(async (collaborator) => await artistDAO.findById(collaborator.artist)))
                return {
                    _id: song?._id,
                    title: song?.title,
                    releaseDate: song?.releaseDate,
                    imgUrl: song?.imgUrl,
                    plays: song?.plays,
                    collaborators: collaborators.map(collaborator => ({
                        _id: collaborator?._id,
                        artistUsername: collaborator?.artistUsername,
                        artistName: collaborator?.artistName
                    }))
                }
            }))
            return {
                ...album,
                productType: undefined,
                author: undefined,
                genres: genres.map(genre => genre?.genre),
                ratings: undefined,
                versionHistory: undefined,
                trackList
            }
        }))
        

        return res.json({
            data: history
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