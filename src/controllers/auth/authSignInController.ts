import express, { NextFunction, Request, request, Response, response } from 'express'
import 'dotenv/config'

export const authSignInController = async(request:express.Request,response:express.Response)=>{
    const user = await request.db?.createBaseUserDAO().findByUid(request.body.uid)
    if (!user) {
        response.send({
            err: 'USER_NOT_FOUND'
        })
        return
    }  
    response.send({
        data: {
            userRole: user?.user_type
        }
    }) 
};