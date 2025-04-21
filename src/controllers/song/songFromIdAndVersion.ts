import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import { version } from 'os';

export const songFromIdAndVersion = async (req: express.Request, res: express.Response) => {
    const { id, version } = req.body
    //console.log("intento obtener el historial de la canción: " + id)
    try {
        if (!id) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }

        const songDAO = req.db!.createSongDAO()
        const cancion = await songDAO.findById(id)

        if (cancion === null) return

        if (version !== -1) {
            const song = await songDAO.getVersionFromVersionHistory(cancion, version)
            if (!song) {
                return res.status(Number(apiErrorCodes[3001].httpCode)).json({
                    error: {
                        code: 3001,
                        message: apiErrorCodes[3001].message
                    }
                })
            }

            const response = {
                song: song
            }

            res.json({
                data: response
            })
        } else {
            /*console.log("La versión buscada es la actual, que tiene los valores: " + cancion._id +
                " , " + cancion.author + " , " + cancion.description + " , " + cancion.pricing)*/

            const response = {
                song: cancion
            }

            res.json({
                data: response
            })
        }
    } catch {
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
};