import express, { NextFunction, Request, request, Response, response } from 'express'
import 'dotenv/config'
import { appFireBase } from '../../utils/firebase';

export const authTokenController = async(request:express.Request,response:express.Response,next:express.NextFunction)=>{
    const token = request.headers.authorization?.split('Bearer ')[1]

    if(!token){
        response.status(401).send('No se ha encontrado token')
        return 
    }

    try{
        const decodedToken = await appFireBase.auth().verifyIdToken(token)
        console.log(decodedToken.uid)
        request.body.uid = decodedToken.uid
        next()
    }catch(error){
        response.status(401).send('Token no valido')
    }
};
