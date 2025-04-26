import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import { client } from '../../utils/redis'
import { getAuth } from 'firebase-admin/auth'
import { appFireBase } from '../../utils/firebase'

export const userPasswordUpdateController = async (req: express.Request, res: express.Response) => {
    const { password, otp } = req.body
    try {
        if (!otp || !password) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }

        const realOtp = await client.hGet('otp', req.uid!)

        if (realOtp != otp) throw new Error()

        await client.hDel('otp', req.uid!)

        await getAuth(appFireBase).updateUser(
            req.uid!, {
            password
        })

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