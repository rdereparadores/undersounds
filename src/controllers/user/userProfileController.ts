import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const userProfileController = async (req: express.Request, res: express.Response) => {
    try {
        const userDAO = req.db!.createBaseUserDAO()
        const user = await userDAO.findByUid(req.body.uid)

        return res.json({
            data: {
                name: user?.name,
                surName: user?.sur_name,
                birthDate: user?.birth_date,
                userName: user?.user_name,
                email: user?.email,
                imgUrl: user?.img_url
            }
        })

    } catch (error) {
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
};
