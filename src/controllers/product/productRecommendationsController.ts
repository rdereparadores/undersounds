import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const productRecommendationsController = async (req: express.Request, res: express.Response) => {
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
        const artistDAO = req.db!.createArtistDAO()
        const genreDAO = req.db!.createGenreDAO()
        const recommendations = await productDAO.findRecommendations({ _id: id }, 5)
        const recommendationsPopulated = await Promise.all(recommendations.map(async (recommendation) => {
            const artist = await artistDAO.findById(recommendation.author)
            const genres = await Promise.all(recommendation.genres.map(async (genre) => await genreDAO.findById(genre)))
            // TODO, PONER COLLABORATORS EN PRODUCT
            const collaborators: { _id: string, artistName: string }[] = []
            return {
                _id: recommendation._id!,
                imgUrl: recommendation.imgUrl,
                title: recommendation.title,
                author: {
                    _id: artist!._id,
                    artistName: artist!.artistName
                },
                collaborators,
                type: recommendation.productType,
                genres: genres.map(genre => genre!.genre)
            }
        }))

        return res.json({
            data: recommendationsPopulated
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