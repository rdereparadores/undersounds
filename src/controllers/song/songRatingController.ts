import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const songRatingController = async (req: express.Request, res: express.Response) => {
    const { songId } = req.body
    try {
        if (!songId) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }

        const songDAO = req.db!.createSongDAO()
        const song = await songDAO.findById(songId)

        if (!song) {
            return res.status(Number(apiErrorCodes[3001].httpCode)).json({
                error: {
                    code: 3001,
                    message: apiErrorCodes[3001].message
                }
            })
        }

        const ratings = await songDAO.getRatings(song)

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
};