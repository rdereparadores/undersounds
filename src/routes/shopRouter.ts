import express from 'express'

const shopRouter = express.Router()

shopRouter.get('query', shopQueryController)