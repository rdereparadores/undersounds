import express from 'express'
import 'dotenv/config'
import { appFireBase } from '../utils/firebase'
import apiErrorCodes from '../utils/apiErrorCodes.json'

export const authTokenMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers.authorization?.split('Bearer ')[1]

    if(!token){
        return res.status(Number(apiErrorCodes[1000].httpCode)).json({
            error: {
                code: 1000,
                message: apiErrorCodes[1000].message
            }
        })
    }

    try {
        const decodedToken = await appFireBase.auth().verifyIdToken(token)
        const userDAO = req.db!.createBaseUserDAO()
        const user = await userDAO.findByUid(decodedToken.uid)

        if (user === null) {
            return res.status(Number(apiErrorCodes[1002].httpCode)).json({
                error: {
                    code: 1002,
                    message: apiErrorCodes[1002].message
                }
            })
        }
        req.body.token = token
        req.uid = decodedToken.uid
        req.body.user_type = user?.user_type
        next()
    } catch {
        return res.status(Number(apiErrorCodes[1002].httpCode)).json({
            error: {
                code: 1002,
                message: apiErrorCodes[1002].message
            }
        })
    }
};