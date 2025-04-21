import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import { AlbumDTO } from '../../dto/AlbumDTO'
import { SongDTO } from '../../dto/SongDTO'

export const songPlayController = async (req: express.Request, res: express.Response) => {
    const { songId } = req.params
    try {
        if (!songId) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }

        const userDAO = req.db!.createBaseUserDAO()
        const songDAO = req.db!.createSongDAO()
        const albumDAO = req.db!.createAlbumDAO()
        const productDAO = req.db!.createProductDAO()
        const user = await userDAO.findByUid(req.uid!)

        let allowedToPlay = false

        await Promise.all(user!.library.map(async (item) => {
            const product = await productDAO.findById(item)
            if (product!.productType === 'song' && songId === item) {
                allowedToPlay = true
                return
            } else if (product!.productType === 'album') {
                const album = await albumDAO.findById(item)
                if (album!.trackList.includes(songId)) {
                    allowedToPlay = true
                    return
                }
            }
        }))

        if (!allowedToPlay && user!.userType === 'artist') {
            const artistProducts = await productDAO.findByArtist({ _id: user!._id! })
            await Promise.all(artistProducts.map(async (item) => {
                if (item.productType === 'song' && songId === item._id) {
                    allowedToPlay = true
                    return
                } else if (item.productType === 'album') {
                    const album = await albumDAO.findById(item._id!)
                    if (album!.trackList.includes(songId)) {
                        allowedToPlay = true
                        return
                    }
                }
            }))
        }

        if (!allowedToPlay) {
            return res.status(Number(apiErrorCodes[1003].httpCode)).json({
                error: {
                    code: 1003,
                    message: apiErrorCodes[1003].message
                }
            })
        }

        const song = await songDAO.findById(songId)
        if (!song) throw new Error()
        song.plays += 1
        await songDAO.update(song)
        await userDAO.addToListeningHistory(user!, song)
        res.sendFile(`${process.cwd()}/${song!.songDir}`)


    } catch (error) {
        console.log(error)
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
}