import express from 'express'
import { UserDTO } from '../../dto/UserDTO';
import { ArtistDTO } from '../../dto/ArtistDTO';
import { appFireBase, auth } from '../../utils/firebase';
import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';
import { FirebaseError } from 'firebase/app';
import apiErrorCodes from '../../utils/apiErrorCodes.json'

const customConfig: Config = {
    dictionaries: [adjectives, colors, animals],
    separator: '-',
    length: 3,
}

export const authSignUpGoogleController = async (req: express.Request, res: express.Response) => {
    try {
        const { idToken, userType, name, email, imgUrl } = req.body
        console.log("INTENTO CREAR UN USUARIO O ARTISTA")
        const decodedToken = await appFireBase.auth().verifyIdToken(idToken)

        const userDAO = req.db!.createBaseUserDAO()
        const artistDAO = req.db!.createArtistDAO()
        const exist = await userDAO.findByUid(decodedToken.uid)

        console.log("La respuesta de si existe es: " + exist)
        console.log("Lo recibido del frontend es: " + name + userType + email)

        const username: string = uniqueNamesGenerator(customConfig)
        const birthDate: Date = new Date(1990, 1, 1)
        console.log("el nombre unico es: " + username + " y la date: " + birthDate)

        if (userType === "user") {
            await userDAO.create(new UserDTO({
                name: name,
                surname: ' ',
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
                artistName: name,
                surname: ' ',
                username: username,
                artistUsername: username,
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
    } catch (error: unknown) {
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

