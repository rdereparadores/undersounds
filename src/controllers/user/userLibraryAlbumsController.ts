import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userLibraryAlbumsController = async (req: express.Request, res: express.Response) => {
    try {
        const userDAO = req.db!.createBaseUserDAO()
        const albumDAO = req.db!.createAlbumDAO()

        const user = await userDAO.findByUid(req.uid!)
        const products = await Promise.all(user!.library.map(async (productId) => await albumDAO.findById(productId)))
        const albums = products.filter(product => product != null)

        return res.json({
            data: albums
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
