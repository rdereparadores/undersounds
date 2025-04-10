import express from 'express'

// CREADO Y REVISADO
export const userProfileUpdateController = async (req: express.Request, res: express.Response) => {
    try {
        const userDAO = req.db!.createBaseUserDAO()
        const user = await userDAO.findByUid(req.body.uid)
        if (req.body.name) {
            user!.name = req.body.name
        }
        if (req.body.surName) {
            user!.sur_name = req.body.surName
        }
        if (req.body.birthDate) {
            user!.birth_date = req.body.birthDate
        }

        await userDAO.update(user!)

        return res.json({
            data: {
                message: 'OK'
            }
        })
    } catch (error) {
        return res.status(500).json({
            error: {
                code: 3000,
                message: 'Error obteniendo la información'
            }
        })
    }
}