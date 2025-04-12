import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userProfileUpdateController = async (req: express.Request, res: express.Response) => {
    try {
        const userDAO = req.db!.createBaseUserDAO()
        const user = await userDAO.findByUid(req.uid!)
        if (req.body.name) {
            user!.name = req.body.name
        }
        if (req.body.surname) {
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
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
}