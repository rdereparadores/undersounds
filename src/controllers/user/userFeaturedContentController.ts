import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import { ProductDTO } from '../../dto/ProductDTO'

export const userFeaturedContentController = async (req: express.Request, res: express.Response) => {
    try {
        const userDAO = req.db!.createBaseUserDAO()
        const artistDAO = req.db!.createArtistDAO()
        const productDAO = req.db!.createProductDAO()
        const user = await userDAO.findByUid(req.uid!)
        const featuredContent: ProductDTO[] = await Promise.all(user!.following.map(async (artistId) => {
            const artist = await artistDAO.findById(artistId)
            const artistProducts = await productDAO.findByArtist(artist!)
            return artistProducts[0]
        }))

        return res.json({
            data: featuredContent
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