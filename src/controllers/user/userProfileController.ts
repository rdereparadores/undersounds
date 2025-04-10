import express from 'express'

// REVISADO
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
        return res.status(500).json({
            error: {
                code: 3000,
                message: 'Error obteniendo la información'
            }
        });
    }
};
