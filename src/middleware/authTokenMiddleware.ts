import express from 'express'
import 'dotenv/config'
import { appFireBase } from '../utils/firebase';

export const authTokenMiddleware = async(request:express.Request,response:express.Response,next:express.NextFunction)=>{
    const token = request.headers.authorization?.split('Bearer ')[1]

    if(!token){
        response.status(401).send({err: 'MISSING_TOKEN'})
        return 
    }

    try{
        const decodedToken = await appFireBase.auth().verifyIdToken(token)
        const user = await request.db?.createBaseUserDAO().findByUid(decodedToken.uid)
        if (user === null) {
            response.status(404).send({
                error: {
                    code: 1000,
                    message: 'Usuario no encontrado'
                }
            })
            return
        }
        request.body.token = token
        request.body.uid = decodedToken.uid
        request.uid = decodedToken.uid
        request.body.user_type = user?.user_type
        next()
    }catch(error){
        response.status(401).send({err: 'INVALID_TOKEN'})
    }
};
