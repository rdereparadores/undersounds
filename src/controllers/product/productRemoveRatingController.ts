import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const productRemoveRatingController = async (req: express.Request, res: express.Response) => {
    const { productId, ratingId } = req.body

    try {
        if (!productId || !ratingId) {
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

        const ratingToRemove = await productDAO.getRatingById(ratingId)

        if (!ratingToRemove) {
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

        if (ratingToRemove.author !== user._id!.toString()) {
            return res.status(Number(apiErrorCodes[1003].httpCode)).json({
                error: {
                    code: 1003,
                    message: apiErrorCodes[1003].message
                }
            })
        }

        const success = await productDAO.removeRating(product, { _id: ratingId })

        if (!success) {
            throw new Error("Error al eliminar la valoración")
        }

        return res.json({
            data: {
                message: 'Valoración eliminada con éxito'
            }
        })
    } catch (error) {
        console.error("Error al eliminar valoración:", error)
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
}