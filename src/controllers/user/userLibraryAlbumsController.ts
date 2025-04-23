import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userLibraryAlbumsController = async (req: express.Request, res: express.Response) => {
    try {
        const userDAO = req.db!.createBaseUserDAO()
        const artistDAO = req.db!.createArtistDAO()
        const albumDAO = req.db!.createAlbumDAO()
        const songDAO = req.db!.createSongDAO()

        const user = await userDAO.findByUid(req.uid!)
        const products = await Promise.all(user!.library.map(async (productId) => await albumDAO.findById(productId)))
        const albums = products.filter(product => product != null)
        const albumsPopulated = await Promise.all(albums.map(async (album) => {
            const artist = await artistDAO.findById(album.author)
            const trackList = await Promise.all(album.trackList.map(async (track) => {
                const trackDoc = await songDAO.findById(track)
                if (!trackDoc) throw new Error()

                const collaborators = await Promise.all(trackDoc.collaborators.map(async (collaborator) => {
                    const artist = await artistDAO.findById(collaborator.artist)
                    return {
                        _id: artist!._id!,
                        artistName: artist!.artistName
                    }
                }))

                return {
                    _id: trackDoc._id,
                    imgUrl: trackDoc.imgUrl,
                    title: trackDoc.title,
                    duration: trackDoc.duration,
                    author: {
                        _id: artist!._id!,
                        artistName: artist!.artistName
                    },
                    collaborators
                }
            }))
            return {
                _id: album._id!,
                imgUrl: album.imgUrl,
                title: album.title,
                duration: album.duration,
                author: {
                    _id: artist!._id!,
                    artistName: artist!.artistName
                },
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
