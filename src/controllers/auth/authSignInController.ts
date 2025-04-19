import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const authSignInController = async(req:express.Request, res:express.Response) => {
    try {
        const userDAO = req.db!.createBaseUserDAO()
        const user = await userDAO.findByUid(req.uid!)
        if (user === null) throw new Error()
        res.json({
            data: {
                userType: user.userType
            }
        }) 
    } catch {
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
    
};