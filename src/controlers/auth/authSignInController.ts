import express, { NextFunction, Request, request, Response, response } from 'express'
import 'dotenv/config'

export const authSignInController = async(request:express.Request,response:express.Response)=>{
    if(request.body.uid !== undefined){
        const user = await request.db?.createUserDAO().findByUid(request.body.uid)
        response.send({adressToken: user?.uid})
    }else{
        response.send({msg: "ERROR"})
    }
};