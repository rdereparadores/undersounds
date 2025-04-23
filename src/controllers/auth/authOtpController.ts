import express, { NextFunction, Request, request, Response, response } from 'express'
import 'dotenv/config'
import { UserDTO } from '../../dto/UserDTO';
import { ArtistDTO } from '../../dto/ArtistDTO';
import { appFireBase, auth } from '../../utils/firebase';
import { uniqueNamesGenerator, NumberDictionary } from 'unique-names-generator';
import { FirebaseError } from 'firebase/app';
import { client } from '../../utils/redis';

export const authSetOtpController = async (request: express.Request, response: express.Response) => {
    try {
        const decodedToken = await appFireBase.auth().verifyIdToken(request.body.idToken)
        console.log("Empiezo a crear el otp de : " + decodedToken.uid)

        const numberDictionary = NumberDictionary.generate({ length: 6 })
        const otp: string = uniqueNamesGenerator({
            dictionaries: [numberDictionary]
        }); //100000-999999

        await client.hSet('otp', decodedToken.uid, otp)
        await client.hExpire('otp',decodedToken.uid,300,'NX' )
        console.log("He creado un otp con 5 min de expiración")

        //TODO enviar email con el OTP


        response.send({ msg: "OK" })
    } catch (error: unknown) {
        response.send({ err: "Fallo al generar el otp." })
    }
};

export const authConfirmOtpController = async (request: express.Request, response: express.Response) => {
    try {
        const decodedToken = await appFireBase.auth().verifyIdToken(request.body.idToken)
        console.log("Intento de confirmar el OTP de : " + decodedToken.uid + " ha introducido: " + request.body.input)
        console.log("El OTP de la base de datos es :" + await client.hGet('otp', decodedToken.uid))

        if(request.body.input === await client.hGet('otp', decodedToken.uid)){
            console.log("OTP confirmado")
            await client.hDel('otp', decodedToken.uid)
            response.send({msg:"OK"})
        }else{
            console.log("OTP invalido")
            response.send({ err: "USER_ALREADY_EXISTS" })
        }
    } catch (error: unknown) {
        response.send({ err: "OTP incorrecto" })
    }
};