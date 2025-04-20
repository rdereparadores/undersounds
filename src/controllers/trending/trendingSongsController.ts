import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const trendingSongsController = async (req: express.Request, res: express.Response) => {
    try {
        const songDAO = req.db!.createSongDAO()
        const artistDAO = req.db!.createArtistDAO()

        const trendingSongs = await songDAO.findMostPlayed(10)

        const trendingSongsPopulated = await Promise.all(trendingSongs.map(async (song) => {
            const artist = await artistDAO.findById(song.author)
            return {
                _id: song._id,
                imgUrl: song.imgUrl,
                title: song.title,
                author: {
                    _id: artist!._id,
                    artistName: artist!.artistName
                }
            }
        }))

        return res.json({
            data: {
                songs: trendingSongsPopulated
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
}