import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import { uploadUserProfileImage } from '../../utils/uploadUserProfileImage'

export const userProfileUpdateImageController = async (req: express.Request, res: express.Response) => {
    uploadUserProfileImage(req, res, async (err) => {
        if (err) {
            return res.status(Number(apiErrorCodes[3002].httpCode)).json({
                error: {
                    code: 3002,
                    message: apiErrorCodes[3002].message
                }
            })
        }

        try {
            if (!req.file) {
                return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                    error: {
                        code: 3000,
                        message: apiErrorCodes[3000].message
                    }
                })
            }
            
            const imgUrl = '/public/uploads/user/profile/' + req.file.filename
            const userDAO = req.db!.createBaseUserDAO()
            const user = await userDAO.findByUid(req.uid!)
            user!.imgUrl = imgUrl
            const result = await userDAO.update(user!)
            if (!result) throw new Error()

            return res.json({
                data: {
                    message: 'OK'
                }
            })
        } catch {
            return res.status(Number(apiErrorCodes[2000].httpCode)).json({
                error: {
                    code: 2000,
                    message: apiErrorCodes[2000].message
                }
            })
        }
    })
}