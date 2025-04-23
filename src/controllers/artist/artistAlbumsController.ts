import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const artistAlbumsController = async (req: express.Request, res: express.Response) => {
    try {
        const artistDAO = req.db!.createArtistDAO()
        const albumDAO = req.db!.createAlbumDAO()
        const songDAO = req.db!.createSongDAO()
        const genreDAO = req.db!.createGenreDAO()
        const artist = await artistDAO.findByUid(req.uid!)
        const albums = await albumDAO.findByArtist({ _id: artist!._id })
        const albumsPopulated = await Promise.all(albums.map(async (album) => {
            const genres = await Promise.all(album.genres.map(async (genre) => await genreDAO.findById(genre)))
            const trackList = await Promise.all(album.trackList.map(async (track) => {
                const song = await songDAO.findById(track)
                const collaborators = await Promise.all(song!.collaborators.map(async (collaborator) => await artistDAO.findById(collaborator.artist)))
                const genres = await Promise.all(song!.genres.map(async (genre) => await genreDAO.findById(genre)))
                return {
                    _id: song?._id,
                    title: song?.title,
                    releaseDate: song?.releaseDate,
                    imgUrl: song?.imgUrl,
                    genres: genres.map(genre => genre!.genre),
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
            data: albumsPopulated
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