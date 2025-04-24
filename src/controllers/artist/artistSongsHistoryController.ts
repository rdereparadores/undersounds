import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import { SongDAO } from '../../dao/SongDAO'

export const artistSongsHistoryController = async (req: express.Request, res: express.Response) => {
    //console.log("intento obtener el historial del id: " + req.body.songId)
    const { songId } = req.body
    try {
        if (!songId) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }
        //console.log("Sigo")
        const songDAO = req.db!.createSongDAO()
        const artistDAO = req.db!.createArtistDAO()
        const genreDAO = req.db!.createGenreDAO()
        const song = await songDAO.findById(songId)
        const artist = await artistDAO.findByUid(req.uid!)
        //console.log("He encontrado al artista: " + artist?.username + " y la canción " + song?.title + " con hisotrial: " + song?.versionHistory)

        if (!song) {
            return res.status(Number(apiErrorCodes[3001].httpCode)).json({
                error: {
                    code: 3001,
                    message: apiErrorCodes[3001].message
                }
            })
        }

        if (song.author != artist?._id!) {
            return res.status(Number(apiErrorCodes[1003].httpCode)).json({
                error: {
                    code: 1003,
                    message: apiErrorCodes[1003].message
                }
            })
        }
        
        //console.log("Sigo he encontrado artista y cancion")
        const history = await Promise.all(song.versionHistory!.map(async (version) => {
            const song = await songDAO.findById(version)
            const genres = await Promise.all(song!.genres.map(async (genre) => genreDAO.findById(genre)))
            const collaborators = await Promise.all(song!.collaborators.map(async (collaborator) => await artistDAO.findById(collaborator.artist)))
            return {
                ...song,
                productType: undefined,
                author: undefined,
                ratings: undefined,
                songDir: undefined,
                genres: genres.map(genre => genre!.genre),
                collaborators: collaborators.map(collaborator => ({
                    _id: collaborator?._id,
                    artistUsername: collaborator?.artistUsername,
                    artistName: collaborator?.artistName,
                    artistImgUrl: collaborator?.artistImgUrl
                }))
            }
        }))
        
        const actualSong = await songDAO.findById(songId)
        const actualGenres = await Promise.all(actualSong!.genres.map(async (genre) => genreDAO.findById(genre)))
        const actualCollaborators = await Promise.all(song!.collaborators.map(async (collaborator) => await artistDAO.findById(collaborator.artist)))

        history.push( {
            ...actualSong,
            productType: undefined,
            author: undefined,
            ratings: undefined,
            songDir: undefined,
            genres: actualGenres.map(genre => genre!.genre),
            collaborators: actualCollaborators.map(collaborator => ({
                _id: collaborator?._id,
                artistUsername: collaborator?.artistUsername,
                artistName: collaborator?.artistName,
                artistImgUrl: collaborator?.artistImgUrl
            }))
        })

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