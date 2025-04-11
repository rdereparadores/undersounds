import express, { NextFunction, Request, request, Response, response } from 'express'
import 'dotenv/config'
import { UserDTO } from '../../dto/UserDTO';
import { ArtistDTO } from '../../dto/ArtistDTO';
import { appFireBase, auth } from '../../utils/firebase';
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';
import { FirebaseError } from 'firebase/app';

const customConfig: Config = {
    dictionaries: [adjectives, colors,animals],
    separator: '-',
    length: 3,
};


const randomName: string = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals]
}); // big_red_donkey


export const authSignUpGoogleController = async (request: express.Request, response: express.Response) => {
    try {
        console.log("INTENTO CREAR UN USUARIO O ARTISTA")
        const decodedToken = await appFireBase.auth().verifyIdToken(request.body.idToken)

        const exist = await request.db?.createBaseUserDAO().findByUid(decodedToken.uid)

        console.log("La respuesta de si existe es: " + exist)
        console.log("Lo recibido del frontend es: " + request.body.name + request.body.userType + request.body.email)

        const userName: string = uniqueNamesGenerator(customConfig);
        const cumple: Date = new Date(1990, 1, 1)
        console.log("el nombre unico es: " + userName + " y la date: "+ cumple)
        if (request.body.userType == "user" && exist === null) {
            console.log("Empiezo a crear usuario")
            const user = await request.db?.createUserDAO().create(new UserDTO({
                name: request.body.name,
                sur_name: " ",
                user_name: userName,
                birth_date: cumple,
                email: request.body.email,
                uid: decodedToken.uid,
                img_url: request.body.img_url,
                user_type: "user",
                following: [],
                library: [],
                listening_history: [],
                addresses: []
            }))
            console.log("He creado un usuario")
            response.send({ msg: { token: decodedToken } })

        } else {
            if (request.body.userType == "artist" && exist === null) {
                console.log("Empiezo a crear artista")
                const registroArtist = request.db?.createArtistDAO().create(new ArtistDTO({
                    name: request.body.name,
                    artist_name: request.body.name,
                    sur_name: " ",
                    user_name: userName,
                    artist_user_name: userName,
                    birth_date: cumple,
                    email: request.body.email,
                    uid: decodedToken.uid,
                    img_url: request.body.img_url,
                    user_type: "artist",
                    following: [],
                    library: [],
                    listening_history: [],
                    addresses: []
                }));
                console.log("He creado un artista")
                response.send({ msg: { token: decodedToken } })

            } else {
                response.send({ err: "USER_ALREADY_EXISTS" })
            }
        }
    } catch (error: unknown) {
        if (error instanceof FirebaseError) {
            const errorCode = error.code
            if (errorCode === 'auth/email-already-in-use') {
                response.send({ err: "EMAIL_ALREADY_IN_USE" })
            } else if (errorCode === 'auth/invalid-email') {
                response.send({ err: "INVALID_EMAIL" })
            } else if (errorCode === 'auth/weak-password') {
                response.send({ err: "WEAK_PASSWORD" })
            }else{
                response.send({err: "No se en q he fallado"})
            }
        }
    }
};

