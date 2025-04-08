import express, { NextFunction, Request, request, Response, response } from 'express'
import 'dotenv/config'
import { UserDTO } from '../../dto/UserDTO';

export const authSignUpController = async (request: express.Request, response: express.Response) => {
    console.log("Entro en el controlador del SignUp")
    //Si el usser_name es undefined quiere decir que es usuario 
    if (request.body.user_type === "user") {
        const user = await request.db?.createUserDAO().create(new UserDTO({
            _id: "",
            name: request.body.name,
            sur_name: request.body.surName,
            user_name: request.body.userName,
            birth_date: request.body.birthDate,
            email: request.body.email,
            uid: request.body.uid,
            img_url: "",
            user_type: 'user',
            following: [],
            library: [],
            listening_history: [],
            addresses: []
        }));
        console.log("Respuesta enviada")
        response.send({msg: "OK",token: request.body.token})

    } else if(request.body.user_type === "artist"){
        const registroArtist = request.db?.createUserDAO().create(new UserDTO({
            _id: request.body,
            name: request.body.name,
            sur_name: request.body.surName,
            user_name: request.body.artistUserName,
            birth_date: request.body.birthDate,
            email: request.body.email,
            uid: request.body.uid,
            img_url: "",
            user_type: 'artist',
            following: [],
            library: [],
            listening_history: [],
            addresses: []
        }));

        response.send({msg: "OK"})

    }else{
        response.send({msg: "ERROR_REGISTER"})
    }
};