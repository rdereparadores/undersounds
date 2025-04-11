import express from 'express'
import { uploadUserProfileImage } from '../../utils/uploadUserProfileImage'

// CREADO Y REVISADO
export const userProfileUpdateImageController = async (req: express.Request, res: express.Response) => {
    uploadUserProfileImage(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                error: {
                    code: 2000,
                    message: 'Error al subir el archivo de imagen'
                }
            })
        }

        try {
            if (!req.file) {
                return res.status(400).json({
                    error: {
                        code: 2001,
                        message: 'Ninguna imagen subida'
                    }
                })
            }
            
            const imgUrl = '/public/uploads/user/profile/' + req.file.filename
            const userDAO = req.db!.createBaseUserDAO()
            const user = await userDAO.findByUid(req.uid!)
            user!.img_url = imgUrl
            await userDAO.update(user!)

            return res.json({
                data: {
                    message: 'OK'
                }
            })
        } catch {
            return res.status(500).json({
                error: {
                    code: 3000,
                    message: 'Error obteniendo la información'
                }
            });
        }
    })
}