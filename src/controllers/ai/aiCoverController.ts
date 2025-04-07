import express from 'express'
import { AzureOpenAI } from 'openai'

export const aiCoverController = async (req: express.Request, res: express.Response) => {
    if (!req.body.prompt) {
        res.status(400).send({ err: 'INVALID_PROMPT' })
        return
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
        res.send({msg: { img_url: result.data[0].url }})
    } catch (_err) {
        res.status(400).send({ err: 'INVALID_PROMPT' })
    }
}