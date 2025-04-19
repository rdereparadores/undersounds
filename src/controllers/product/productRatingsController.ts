import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const productRatingsController = async (req: express.Request, res: express.Response) => {
    const { id } = req.body
    try {
        if (!id) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }

        const productDAO = req.db!.createProductDAO()
        const product = await productDAO.findById(id)

        if (!product) {
            return res.status(Number(apiErrorCodes[3001].httpCode)).json({
                error: {
                    code: 3001,
                    message: apiErrorCodes[3001].message
                }
            })
        }

        const ratings = await productDAO.getRatings(product)

        let averageRating = 0
        if (ratings && ratings.length > 0) {
            const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0)
            averageRating = sum / ratings.length
        }

        const response = {
            ratings: ratings || [],
            averageRating,
            totalRatings: ratings ? ratings.length : 0
        };

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
}