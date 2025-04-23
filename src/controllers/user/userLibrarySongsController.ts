import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userLibrarySongsController = async (req: express.Request, res: express.Response) => {
    try {
        const userDAO = req.db!.createBaseUserDAO()
        const artistDAO = req.db!.createArtistDAO()
        const songDAO = req.db!.createSongDAO()

        const user = await userDAO.findByUid(req.uid!)
        const products = await Promise.all(user!.library.map(async (productId) => await songDAO.findById(productId)))
        const songs = products.filter(product => product != null)
        const songsPopulated = await Promise.all(songs.map(async (song) => {
            const author = await artistDAO.findById(song.author)
            const collaborators = await Promise.all(song.collaborators.map(async (collaborator) => await artistDAO.findById(collaborator.artist)))

            return {
                _id: song._id!,
                imgUrl: song.imgUrl,
                title: song.title,
                duration: song.duration,
                author: {
                    _id: author!._id!,
                    artistName: author!.artistName
                },
                collaborators: collaborators.map(collaborator => ({
                    _id: collaborator!._id!,
                    artistName: collaborator!.artistName
                }))
            }
        }))

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
