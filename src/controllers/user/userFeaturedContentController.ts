import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userFeaturedContentController = async (req: express.Request, res: express.Response) => {
    try {
        const userDAO = req.db!.createBaseUserDAO()
        const artistDAO = req.db!.createArtistDAO()
        const productDAO = req.db!.createProductDAO()
        const user = await userDAO.findByUid(req.uid!)
        const featuredContent: any[] = await Promise.all(user!.following.map(async (artistId) => {
            const artist = await artistDAO.findById(artistId)
            const artistProducts = await productDAO.findByArtist(artist!)
            const product = artistProducts[0]
            if (!product) return undefined
            return {
                imgUrl: product.imgUrl,
                title: product.title,
                type: product.productType,
                _id: product._id!,
                releaseDate: product.releaseDate,
                author: {
                    artistUsername: artist?.artistUsername,
                    artistName: artist?.artistName
                }
            }
        }))

        return res.json({
            data: featuredContent.filter(c => c !== undefined).sort((a, b) => {
                const dateA = new Date(a.releaseDate)
                const dateB = new Date(b.releaseDate)
                return dateB.getDate() - dateA.getDate()
            }).slice(0, 4)
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