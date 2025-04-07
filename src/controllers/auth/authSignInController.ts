import express, { NextFunction, Request, request, Response, response } from 'express'
import 'dotenv/config'

export const authSignInController = async(request:express.Request,response:express.Response)=>{
    console.log(request.body.uid)

};