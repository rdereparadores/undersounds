import express from 'express'
import { AzureOpenAI } from 'openai'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const aiImageController = async (req: express.Request, res: express.Response) => {
    const { prompt } = req.body
    if (!prompt) {
        return res.status(Number(apiErrorCodes[5000].httpCode)).json({
            error: {
                code: 5000,
                message: apiErrorCodes[5000].message
            }
        })
    }
    const deployment = 'dall-e-3'
    const apiVersion = '2024-04-01-preview'
    try {
        const client = new AzureOpenAI({
            deployment,
            apiVersion,
            endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
            apiKey: process.env.AZURE_OPENAI_API_KEY!
        })
        const result = await client.images.generate({
            prompt: req.body.prompt,
            model: '',
            n: 1,
            size: '1024x1024'
        })
        res.json({
            data: {
                imgUrl: result.data[0].url
            }
        })
    } catch {
        return res.status(Number(apiErrorCodes[5000].httpCode)).json({
            error: {
                code: 5000,
                message: apiErrorCodes[5000].message
            }
        })
    }
}