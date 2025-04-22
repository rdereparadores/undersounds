import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const productCheckUserRatingController = async (req: express.Request, res: express.Response) => {
    const { productId, format } = req.body

    try {
        if (!productId) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }

        const productDAO = req.db!.createProductDAO()
        const product = await productDAO.findById(productId)

        if (!product) {
            return res.status(Number(apiErrorCodes[3001].httpCode)).json({
                error: {
                    code: 3001,
                    message: apiErrorCodes[3001].message
                }
            })
        }

        const userDAO = req.db!.createBaseUserDAO()
        const user = await userDAO.findByUid(req.uid!)

        if (!user) {
            return res.status(Number(apiErrorCodes[1002].httpCode)).json({
                error: {
                    code: 1002,
                    message: apiErrorCodes[1002].message
                }
            })
        }

        const ratings = await productDAO.getRatings(product)

        const userRatings = format
            ? ratings.filter(r => r.author === user._id!.toString() && r.format === format)
            : ratings.filter(r => r.author === user._id!.toString());

        return res.json({
            data: {
                hasRated: userRatings.length > 0,
                ratings: userRatings.length > 0 ? userRatings : null,
                userId: user._id
            }
        })
    } catch (error) {
        console.error("Error al verificar valoraciones de usuario:", error)
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
}