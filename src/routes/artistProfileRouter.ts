import express from 'express'

const artistProfileRouter = express.Router()

artistProfileRouter.get('info', artistProfileInfoController)