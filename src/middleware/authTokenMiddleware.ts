import express, { NextFunction, Request, request, Response, response } from 'express'
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
        console.log(`Token: ${token}`)
        console.log(`Uid del token desencriptado: ${decodedToken.uid}`)
        const user = await request.db?.createUserDAO().findByUid(decodedToken.uid)
        request.body.token = token
        request.body.uid = decodedToken.uid
        request.body.user_type = user?.user_type
        next()
    }catch(error){
        response.status(401).send({err: 'INVALID_TOKEN'})
    }
};
