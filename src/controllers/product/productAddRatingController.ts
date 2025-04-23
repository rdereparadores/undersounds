import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import { RatingDTO } from '../../dto/RatingDTO'

export const productAddRatingController = async (req: express.Request, res: express.Response) => {
    const { productId, rating, title, description, format } = req.body

    try {
        if (!productId || rating === undefined || !title || !description || !format) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }

        if (rating < 1 || rating > 5) {
            return res.status(Number(apiErrorCodes[3001].httpCode)).json({
                error: {
                    code: 3001,
                    message: "La valoración debe estar entre 1 y 5"
                }
            })
        }

        const validFormats = ['digital', 'cd', 'vinyl', 'cassette'];
        if (!validFormats.includes(format)) {
            return res.status(Number(apiErrorCodes[3001].httpCode)).json({
                error: {
                    code: 3001,
                    message: "Formato no válido"
                }
            })
        }

        const productDAO = req.db!.createProductDAO()
        const orderDAO = req.db!.createOrderDAO()

        const product = await productDAO.findById(productId)

        if (!product) {
            return res.status(Number(apiErrorCodes[3001].httpCode)).json({
                error: {
                    code: 3001,
                    message: apiErrorCodes[3001].message
                }
            })
        }

        const hasPurchased = await orderDAO.hasUserPurchasedProductFormat(req.uid!, productId, format)

        if (!hasPurchased) {
            return res.status(Number(apiErrorCodes[1003].httpCode)).json({
                error: {
                    code: 1003,
                    message: "No has comprado este producto en este formato"
                }
            })
        }

        const hasRated = await productDAO.hasUserRatedProductFormat(req.uid!, productId, format)

        if (hasRated) {
            return res.status(Number(apiErrorCodes[3003].httpCode)).json({
                error: {
                    code: 3003,
                    message: "Ya has valorado este producto en este formato"
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

        const ratingDTO = new RatingDTO({
            rating,
            title,
            description,
            publishDate: new Date(),
            author: user._id!,
            format
        })

        const success = await productDAO.addRating(product, ratingDTO)

        if (!success) {
            throw new Error("Error al agregar la valoración")
        }

        return res.json({
            data: {
                message: 'Valoración agregada con éxito'
            }
        })
    } catch (error) {
        console.error("Error al agregar valoración:", error)
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
}