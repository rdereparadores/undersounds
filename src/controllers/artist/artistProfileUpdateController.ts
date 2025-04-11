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
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
};
