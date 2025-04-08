import express, { NextFunction, Request, request, Response, response } from 'express'
import 'dotenv/config'

export const authSignInController = async(request:express.Request,response:express.Response)=>{
    const user = await request.db?.createBaseUserDAO().findByUid(request.body.uid)
    response.send({msg:user?.user_type})   
};