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
                surname: surname,
                username: username,
                birthDate: birthDate,
                email: email,
                uid: decodedToken.uid,
                imgUrl: '/public/uploads/user/profile/generic.jpg',
                userType: 'user',
                following: [],
                library: [],
                listeningHistory: [],
                addresses: []
            }))
        } else if (userType === "artist") {
            await artistDAO.create(new ArtistDTO({
                name: name,
                artistName: artistName,
                surname: surname,
                username: username,
                artistUsername: artistUsername,
                birthDate: birthDate,
                email: email,
                uid: decodedToken.uid,
                imgUrl: '/public/uploads/user/profile/generic.jpg',
                userType: 'artist',
                following: [],
                library: [],
                listeningHistory: [],
                addresses: [],
                artistBannerUrl: '/public/uploads/artist/banner/generic.jpg',
                artistImgUrl: '/public/uploads/artist/profile/generic.jpg',
                followerCount: 0
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

