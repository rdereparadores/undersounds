import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const productUserPurchasedFormatsController = async (req: express.Request, res: express.Response) => {
    const { productId } = req.body

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

        const orderDAO = req.db!.createOrderDAO()

        const purchasedFormats = await orderDAO.getUserPurchasedProductFormats(req.uid!, productId)

        const ratedFormats = await productDAO.getUserRatedFormats(req.uid!, productId)

        return res.json({
            data: {
                formats: purchasedFormats,
                ratedFormats
            }
        })
    } catch (error) {
        console.error("Error al obtener formatos comprados:", error)
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
}