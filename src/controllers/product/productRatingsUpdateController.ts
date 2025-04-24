import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const productRatingsUpdateController = async (req: express.Request, res: express.Response) => {
    const { id, rating, title, description } = req.body
    try {
        if (!id) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }

        const userDAO = req.db!.createBaseUserDAO()
        const productDAO = req.db!.createProductDAO()

        const user = await userDAO.findByUid(req.uid!)
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
        const userRating = ratings.filter(r => r.author == user!._id!)
        if (userRating.length === 0) {
            return res.status(Number(apiErrorCodes[1003].httpCode)).json({
                error: {
                    code: 1003,
                    message: apiErrorCodes[1003].message
                }
            })
        }

        if (rating) {
            userRating[0].rating = rating
        }

        if (title) {
            userRating[0].title = title
        }

        if (description) {
            userRating[0].description = description
        }

        await productDAO.updateRating(userRating[0])

        return res.json({
            data: {
                message: 'OK'
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