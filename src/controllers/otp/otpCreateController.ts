import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import { uniqueNamesGenerator, NumberDictionary } from 'unique-names-generator'
import { client } from '../../utils/redis'
import { transporter } from '../../utils/mailSending'
import { otpCreated } from '../../utils/mailTemplates/otpCreated'

export const otpCreateController = async (req: express.Request, res: express.Response) => {
    try {
        const userDAO = req.db!.createBaseUserDAO()
        const user = await userDAO.findByUid(req.uid!)

        const numberDictionary = NumberDictionary.generate({ length: 6 })
        const otp = uniqueNamesGenerator({
            dictionaries: [numberDictionary]
        })

        await client.hSet('otp', req.uid!, otp)
        await client.hExpire('otp', req.uid!, 300, 'NX')

        await transporter.sendMail({
            from: '"Soporte Undersounds" <soporteundersounds@gmail.com>',
            to: user!.email,
            subject: `Tu código de un solo uso es ${otp}`,
            html: otpCreated(Number(otp), user!.username)
        })

        res.send({
            data: {
                message: "OK"
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