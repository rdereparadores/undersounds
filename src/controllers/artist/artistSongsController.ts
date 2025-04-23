import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const artistSongsController = async (req: express.Request, res: express.Response) => {
    try {
        const artistDAO = req.db!.createArtistDAO()
        const songDAO = req.db!.createSongDAO()
        const genreDAO = req.db!.createGenreDAO()
        const artist = await artistDAO.findByUid(req.uid!)
        const songs = await songDAO.findByArtist({ _id: artist!._id })
        const songsPopulated = await Promise.all(songs.map(async (song) => {
            const genres = await Promise.all(song.genres.map(async (genre) => genreDAO.findById(genre)))
            const collaborators = await Promise.all(song.collaborators.map(async (collaborator) => await artistDAO.findById(collaborator.artist)))
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
                    artistName: collaborator?.artistName,
                    artistImgUrl: collaborator?.artistImgUrl
                }))
            }

        }))

        //console.log(songs)
        return res.json({
            data: songsPopulated
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