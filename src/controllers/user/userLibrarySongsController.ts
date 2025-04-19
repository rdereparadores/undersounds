import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userLibrarySongsController = async (req: express.Request, res: express.Response) => {
    try {
        const userDAO = req.db!.createBaseUserDAO()
        const songDAO = req.db!.createSongDAO()

        const user = await userDAO.findByUid(req.uid!)
        const products = await Promise.all(user!.library.map(async (productId) => await songDAO.findById(productId)))
        const songs = products.filter(product => product != null)

        return res.json({
            data: songs
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
