import express, { NextFunction, Request, request, Response, response } from 'express'
import 'dotenv/config'

export const authSignInController = async(request:express.Request,response:express.Response)=>{
    const user = await request.db?.createUserDAO().findByUid(request.body.decodedToken.uid)
    response.send({adressToken: user?.uid})
};