// userPasswordResetController.ts
import express from 'express'
import { getAuth } from 'firebase-admin/auth'

export const userPasswordResetController = async (req: express.Request, res: express.Response) => {
    try {
        if (!req.body.email) {
            return res.status(400).json({
                error: {
                    code: 2005,
                    message: 'El email es requerido'
                }
            })
        }

        const userDAO = req.db!.createUserDAO()

        const user = await userDAO.findByEmail(req.body.email)
        if (!user) {
            return res.json({
                data: {
                    message: 'Si el email está registrado, recibirás un correo para restablecer tu contraseña'
                }
            })
        }

        await getAuth().updateUser(
            req.body.uid, {
                password: req.body.password
            }
        )

        return res.json({
            data: {
                message: 'Se ha actualizado correctamente la contraseña'
            }
        })
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error)

        return res.status(500).json({
            error: {
                code: 3000,
                message: 'Error al procesar la solicitud'
            }
        })
    }
}