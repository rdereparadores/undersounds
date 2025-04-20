import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const songInfoController = async (req: express.Request, res: express.Response) => {
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

        const songDAO = req.db!.createSongDAO()
        const artistDAO = req.db!.createArtistDAO()
        const genreDAO = req.db!.createGenreDAO()
        const song = await songDAO.findById(songId)

        if (!song) {
            return res.status(Number(apiErrorCodes[3001].httpCode)).json({
                error: {
                    code: 3001,
                    message: apiErrorCodes[3001].message
                }
            })
        }

        const artist = await artistDAO.findById(song.author)
        const genres = await Promise.all(song.genres.map(async (genreId) => {
            const genreDoc = await genreDAO.findById(genreId)
            return genreDoc!.genre
        }))
        const collaborators = await Promise.all(song!.collaborators.filter(c => c.accepted).map(async (collaborator) => {
            const artist = await artistDAO.findById(collaborator.artist)
            return {
                _id: artist!._id!,
                artistName: artist!.artistName,
                artistUsername: artist!.artistUsername,
                artistImgUrl: artist!.artistImgUrl,
                followers: artist!.followerCount
            }
        }))

        const response = {
            song: {
                ...song,
                author: {
                    _id: artist!._id,
                    artistName: artist!.artistName,
                    artistImgUrl: artist!.artistImgUrl,
                    artistUsername: artist!.artistUsername,
                    followers: artist!.followerCount
                },
                genres,
                collaborators,
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
};