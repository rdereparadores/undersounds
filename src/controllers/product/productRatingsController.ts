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
        const userDAO = req.db!.createBaseUserDAO()

        const ratingsWithUserInfo = [];
        for (const rating of ratings) {
            try {
                const user = await userDAO.findById(rating.author);
                ratingsWithUserInfo.push({
                    ...rating,
                    authorUsername: user?.username || 'Usuario desconocido',
                    authorImgUrl: user?.imgUrl || '/public/uploads/user/profile/generic.jpg'
                });
            } catch (error) {
                ratingsWithUserInfo.push({
                    ...rating,
                    authorUsername: 'Usuario desconocido',
                    authorImgUrl: '/public/uploads/user/profile/generic.jpg'
                });
            }
        }

        let averageRating = 0
        if (ratingsWithUserInfo && ratingsWithUserInfo.length > 0) {
            const sum = ratingsWithUserInfo.reduce((acc, rating) => acc + rating.rating, 0)
            averageRating = sum / ratingsWithUserInfo.length
        }

        const response = {
            ratings: ratingsWithUserInfo || [],
            averageRating,
            totalRatings: ratingsWithUserInfo ? ratingsWithUserInfo.length : 0
        }

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