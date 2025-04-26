import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import { getAuth } from 'firebase-admin/auth'
import { client } from '../../utils/redis'
import { appFireBase } from '../../utils/firebase'

export const userEmailUpdateController = async (req: express.Request, res: express.Response) => {
    const { email, otp } = req.body
    try {
        if (!otp || !email) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }

        const userDAO = req.db!.createBaseUserDAO()
        const user = await userDAO.findByUid(req.uid!)

        const realOtp = await client.hGet('otp', req.uid!)

        if (realOtp != otp) throw new Error()

        await client.hDel('otp', req.uid!)

        await getAuth(appFireBase).updateUser(
            req.uid!, {
            email
        }
        )

        user!.email = email
        await userDAO.update(user!)

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
}