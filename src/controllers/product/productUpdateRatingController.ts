import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const productUpdateRatingController = async (req: express.Request, res: express.Response) => {
    const { productId, ratingId, rating, title, description } = req.body

    try {
        if (!productId || !ratingId || rating === undefined || !title || !description) {
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

        const productDAO = req.db!.createProductDAO()

        const product = await productDAO.findById(productId)
        if (!product) {
            return res.status(Number(apiErrorCodes[3001].httpCode)).json({
                error: {
                    code: 3001,
                    message: "Producto no encontrado"
                }
            })
        }

        const existingRating = await productDAO.getRatingById(ratingId)

        if (!existingRating) {
            return res.status(Number(apiErrorCodes[3001].httpCode)).json({
                error: {
                    code: 3001,
                    message: "Valoración no encontrada"
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

        if (existingRating.author !== user._id!.toString()) {
            return res.status(Number(apiErrorCodes[1003].httpCode)).json({
                error: {
                    code: 1003,
                    message: apiErrorCodes[1003].message
                }
            })
        }

        const updated = await productDAO.updateRating(ratingId, {
            rating,
            title,
            description
        })

        if (!updated) {
            throw new Error("Error al actualizar la valoración")
        }

        return res.json({
            data: {
                message: 'Valoración actualizada con éxito'
            }
        })
    } catch (error) {
        console.error("Error al actualizar valoración:", error)
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
}