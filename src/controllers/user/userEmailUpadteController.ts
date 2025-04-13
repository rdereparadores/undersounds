import express from 'express'
import {getAuth} from "firebase-admin/auth";

export const userEmailUpdateController = async (req: express.Request, res: express.Response) => {
    try {
        if (!req.body.uid || !req.body.email) {
            return res.status(400).json({
                error: {
                    code: 2002,
                    message: 'UID y email son requeridos'
                }
            })
        }

        const userDAO = req.db!.createUserDAO()

        const existingUser = await userDAO.findByEmail(req.body.email)
        if (existingUser && existingUser.uid !== req.body.uid) {
            return res.status(409).json({
                error: {
                    code: 2003,
                    message: 'Este email ya está en uso'
                }
            })
        }

        const user = await userDAO.findByUid(req.body.uid)
        if (!user) {
            return res.status(404).json({
                error: {
                    code: 2004,
                    message: 'Usuario no encontrado'
                }
            })
        }

        await getAuth().updateUser(
            req.body.uid, {
                email: req.body.email
            }
        )

        user.email = req.body.email
        await userDAO.update(user)

        return res.json({
            data: {
                message: 'OK'
            }
        })
    } catch (error) {
        console.error('Error al actualizar email:', error)
        return res.status(500).json({
            error: {
                code: 3000,
                message: 'Error actualizando el email'
            }
        })
    }
}