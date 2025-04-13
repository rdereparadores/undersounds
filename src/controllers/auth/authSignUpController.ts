import express from 'express'
import 'dotenv/config'
import { UserDTO } from '../../dto/UserDTO'
import { ArtistDTO } from '../../dto/ArtistDTO'
import { appFireBase, auth } from '../../utils/firebase'
import { createUserWithEmailAndPassword } from "firebase/auth"
import { FirebaseError } from 'firebase/app'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const authSignUpController = async (req: express.Request, res: express.Response) => {
    try {
        const { name, surname, username, birthDate, email, password, userType, artistName, artistUsername } = req.body
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const idToken = await userCredential.user.getIdToken()

        const decodedToken = await appFireBase.auth().verifyIdToken(idToken)

        const userDAO = req.db!.createUserDAO()
        const artistDAO = req.db!.createArtistDAO()

        if (userType === "user") {
            await userDAO.create(new UserDTO({
                name: name,
                sur_name: surname,
                user_name: username,
                birth_date: birthDate,
                email: email,
                uid: decodedToken.uid,
                img_url: "",
                user_type: 'user',
                following: [],
                library: [],
                listening_history: [],
                addresses: []
            }))
        } else if (userType === "artist") {
            await artistDAO.create(new ArtistDTO({
                name: name,
                artist_name: artistName,
                sur_name: surname,
                user_name: artistUsername,
                artist_user_name: artistUsername,
                birth_date: birthDate,
                email: email,
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
        } else {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }

        res.json({
            data: {
                token: idToken
            }
        })
    } catch (error) {
        if (error instanceof FirebaseError) {
            const errorCode = error.code
            if (errorCode === 'auth/email-already-in-use') {
                return res.status(Number(apiErrorCodes[4001].httpCode)).json({
                    error: {
                        code: 4001,
                        message: apiErrorCodes[4001].message
                    }
                })
            } else if (errorCode === 'auth/invalid-email') {
                return res.status(Number(apiErrorCodes[4002].httpCode)).json({
                    error: {
                        code: 4002,
                        message: apiErrorCodes[4002].message
                    }
                })
            }
        }
    }
};

