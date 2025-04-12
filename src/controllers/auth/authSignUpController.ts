import express from 'express'
import 'dotenv/config'
import { UserDTO } from '../../dto/UserDTO';
import { ArtistDTO } from '../../dto/ArtistDTO';
import { appFireBase, auth } from '../../utils/firebase';
import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { FirebaseError } from 'firebase/app'
import apiErrorCodes from '../../utils/apiErrorCodes.json'


export const authSignUpController = async (req: express.Request, res: express.Response) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, req.body.email, req.body.password)
        const idToken = await userCredential.user.getIdToken()

        const decodedToken = await appFireBase.auth().verifyIdToken(idToken)

        const exist = await req.db?.createBaseUserDAO().findByUid(decodedToken.uid)

        if (req.body.userType === "user" && exist === null) {
            const user = await req.db?.createUserDAO().create(new UserDTO({
                name: req.body.name,
                sur_name: req.body.surName,
                user_name: req.body.userName,
                birth_date: req.body.birthDate,
                email: req.body.email,
                uid: decodedToken.uid,
                img_url: "",
                user_type: 'user',
                following: [],
                library: [],
                listening_history: [],
                addresses: []
            }))
            res.json({
                data: {
                    token: decodedToken
                }
            })

        } else {
            if (req.body.userType === "artist" && exist === null) {
                const registroArtist = req.db?.createArtistDAO().create(new ArtistDTO({
                    name: req.body.name,
                    artist_name: req.body.artistName,
                    sur_name: req.body.surName,
                    user_name: req.body.artistUserName,
                    artist_user_name: req.body.artistUserName,
                    birth_date: req.body.birthDate,
                    email: req.body.email,
                    uid: decodedToken.uid,
                    img_url: "",
                    user_type: 'artist',
                    following: [],
                    library: [],
                    listening_history: [],
                    addresses: [],
                    artist_banner_img_url: '',
                    artist_img_url: ''
                }))

                res.json({
                    data: {
                        token: decodedToken
                    }
                })

            } else {
                return res.status(Number(apiErrorCodes[4000].httpCode)).json({
                    error: {
                        code: 4000,
                        message: apiErrorCodes[4000].message
                    }
                })
            }
        }
    } catch (error: unknown) {
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
        /*if (error instanceof FirebaseError) {
            const errorCode = error.code
            if (errorCode === 'auth/email-already-in-use') {
                res.send({ err: "EMAIL_ALREADY_IN_USE" })
            } else if (errorCode === 'auth/invalid-email') {
                res.send({ err: "INVALID_EMAIL" })
            } else if (errorCode === 'auth/weak-password') {
                res.send({ err: "WEAK_PASSWORD" })
            }
        }*/
    }
};

