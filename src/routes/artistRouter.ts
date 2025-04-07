import express from 'express'

const artistRouter = express.Router()

artistRouter.get('profile', artistProfileController)
artistRouter.post('profile/update', artistProfileUpdateController)