import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userProfileUpdateController = async (req: express.Request, res: express.Response) => {
    const { name, surname, birthDate } = req.body
    try {
        const userDAO = req.db!.createBaseUserDAO()
        const user = await userDAO.findByUid(req.uid!)
        if (name) {
            user!.name = name
        }
        if (surname) {
            user!.surname = surname
        }
        if (birthDate) {
            user!.birthDate = birthDate
        }

        const result = await userDAO.update(user!)
        if (!result) throw new Error()

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