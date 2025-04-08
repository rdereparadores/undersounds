import express, { NextFunction, Request, request, Response, response } from 'express'
import 'dotenv/config'
import { UserDTO } from '../../dto/UserDTO';
import { ArtistDTO } from '../../dto/ArtistDTO';
import { appFireBase, auth } from '../../utils/firebase';
import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { FirebaseError } from 'firebase/app';


export const authSignUpController = async (request: express.Request, response: express.Response) => {
    try {
        console.log("Entro en el controlador del SignUp")
        console.log("Empiezo a crear el usuario")
        const userCredential = await createUserWithEmailAndPassword(auth, request.body.email, request.body.password)
        const idToken = await userCredential.user.getIdToken()
        const decodedToken = await appFireBase.auth().verifyIdToken(idToken)

        console.log(`He creado un usuario con token : ${decodedToken}`)
        console.log(`He creado un usuario con uid : ${decodedToken.uid}`)
        const exist = await request.db?.createBaseUserDAO().findByUid(decodedToken.uid)

        console.log(`He verificado al usuario ${exist}`)
        //Si el user_name es undefined quiere decir que es usuario 

        if (request.body.userType === "user" && exist === null) {
            const user = await request.db?.createUserDAO().create(new UserDTO({
                name: request.body.name,
                sur_name: request.body.surName,
                user_name: request.body.userName,
                birth_date: request.body.birthDate,
                email: request.body.email,
                uid: decodedToken.uid,
                img_url: "",
                user_type: 'user',
                following: [],
                library: [],
                listening_history: [],
                addresses: []
            }));
            response.cookie
            console.log("Respuesta enviada, nuevo ussuario registrado")
            response.send({msg:{ token: decodedToken}})

        } else
            //Artistas
            if (request.body.userType === "artist" && exist === null) {
                const registroArtist = request.db?.createArtistDAO().create(new ArtistDTO({
                    name: request.body.name,
                    artist_name: request.body.artistName,
                    sur_name: request.body.surName,
                    user_name: request.body.artistUserName,
                    artist_user_name: request.body.artistUserName,
                    birth_date: request.body.birthDate,
                    email: request.body.email,
                    uid: decodedToken.uid,
                    img_url: "",
                    user_type: 'artist',
                    following: [],
                    library: [],
                    listening_history: [],
                    addresses: []
                }));
                console.log("Respuesta enviada, nuevo srtista registrado")
                response.send({msg:{ token: decodedToken}})

            } else {
                response.send({ err: "USER_ALREADY_EXISTS" })
            }
    } catch (error: unknown) {
        if (error instanceof FirebaseError) {
            const errorCode = error.code
            if (errorCode === 'auth/email-already-in-use') {
                response.send({ err:"EMAIL_ALREADY_IN_USE"})
            } else if (errorCode === 'auth/invalid-email') {
                response.send({ err:"INVALID_EMAIL"})
            } else if (errorCode === 'auth/weak-password') {
                response.send({ err:"WEAK_PASSWORD"})
            }
        }
    }
};

