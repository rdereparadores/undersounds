

import express, { NextFunction, Request, request, Response, response } from 'express'
import 'dotenv/config'
import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import * as serviceAccount from '../admin.json';
import admin from 'firebase-admin';

const authRouter = express.Router()
authRouter.use(express.json())

//Inicializa firebase
const appFireBase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});


const authTokenController = async(request:express.Request,response:express.Response,next:express.NextFunction)=>{
    const token = request.headers.authorization?.split('Bearer ')[1]

    if(!token){
        response.status(401).send('No se ha encontrado token')
        return 
    }

    try{
        const decodedToken = await appFireBase.auth().verifyIdToken(token)
        console.log(decodedToken.uid)
        request.body.uid = decodedToken.uid
        request.body = request.body
        next()
    }catch(error){
        response.status(401).send('Token no valido')
    }
};

authRouter.post('/api/auth/signup',authTokenController,(request:express.Request,response:express.Response)=>{
    console.log("He añadido a la base de datos los siguientes campos: ")
    console.log(`El token decodificado con uid: ${request.body.uid}`)
    console.log(`El nombre del usuario: ${request.body.name}`)
    console.log(`El apellido del usuario: ${request.body.surName}`)
    console.log(`El email del usuario: ${request.body.email}`)
    console.log(`El cumpleaños del usuario: ${request.body.birthDate}`)
    response.json({mensaje:`Hola, ${request.body.name} ${request.body.surName}, con uid ${request.body.uid}, correo ${request.body.email} y cum ${request.body.birthDate}`})
})

authRouter.post('signup', authSignUpController)
authRouter.post('signin', authSignInController)
authRouter.post('token', authTokenController)