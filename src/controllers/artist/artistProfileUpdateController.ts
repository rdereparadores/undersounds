import express from 'express'

export const artistProfileUpdateController = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    try {

        const { uid, artistUserName, artistName } = req.body

        const artistDAO = req.db!.createArtistDAO()
        const artist = await artistDAO.findByUid(uid)

        if (artistName) artist!.artist_name = artistName
        if (artistUserName) artist!.artist_user_name = artistUserName

        const updatedArtist = await artistDAO.update(artist!)

        return res.status(200).json({
            data: {
                message: 'Perfil actualizado con éxito'
            }
        });
    } catch {
        return res.status(500).json({
            error: {
                code: 1000,
                message: 'UPDATE_ARTIST_ERROR'
            }
        });
    }
};
