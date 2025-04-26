import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const profileArtistSearchController = async (req: express.Request, res: express.Response) => {
    const { query } = req.body

    try {
        if (!query) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }

        const artistDAO = req.db!.createArtistDAO()
        const result = await artistDAO.searchByArtistUsername(query)

        return res.json({
            data: result.map(artist => ({
                artistUsername: artist.artistUsername,
                artistName: artist.artistName,
                artistImgUrl: artist.artistImgUrl
            }))
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