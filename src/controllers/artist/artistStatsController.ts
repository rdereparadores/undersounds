import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import { mostFrequentValue } from '../../utils/mostFrequentValue'

export const artistStatsController = async (req: express.Request, res: express.Response) => {
    try {
        const artistDAO = req.db!.createArtistDAO()
        const userDAO = req.db!.createBaseUserDAO()
        const productDAO = req.db!.createProductDAO()
        const orderDAO = req.db!.createOrderDAO()
        const artist = await artistDAO.findByUid(req.uid!)

        const copiesSold = { thisMonth: 0, pastMonth: 0 }
        const releases = { thisMonth: 0, pastMonth: 0 }
        const mostSoldFormat = { format: 'N/A', percentage: -1 }
        const monthlyListeners = { thisMonth: 0, pastMonth: 0 }
        const salesFormat = { digital: 0, cd: 0, cassette: 0, vinyl: 0 }
        const topProducts: { title: string, sales: number }[] = []

        const allCopiesSold = await orderDAO.findItemsSoldByArtist(artist!)
        const copiesThisMonth = allCopiesSold!.filter(line => {
            const date = new Date(line.purchaseDate)
            const today = new Date()
            return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
        })
        const copiesPastMonth = allCopiesSold!.filter(line => {
            const date = new Date(line.purchaseDate)
            const today = new Date()
            return date.getMonth() === today.getMonth() - 1 && date.getFullYear() === today.getFullYear()
        })

        const artistProducts = await productDAO.findByArtist(artist!)
        const artistsProductsThisMonth = artistProducts.filter(product => {
            const releaseDate = new Date(product.releaseDate)
            const today = new Date()
            return releaseDate.getMonth() === today.getMonth() && releaseDate.getFullYear() === today.getFullYear()
        })
        const artistsProductsPastMonth = artistProducts.filter(product => {
            const releaseDate = new Date(product.releaseDate)
            const today = new Date()
            return releaseDate.getMonth() === today.getMonth() - 1 && releaseDate.getFullYear() === today.getFullYear()
        })

        // CÁLCULO DE COPIESSOLD
        copiesSold.thisMonth = copiesThisMonth.reduce((sum, copy) => sum + copy.quantity, 0)
        copiesSold.pastMonth = copiesPastMonth.reduce((sum, copy) => sum + copy.quantity, 0)

        // CÁLCULO DE RELEASES
        releases.thisMonth = artistsProductsThisMonth.length
        releases.pastMonth = artistsProductsPastMonth.length

        // CÁLCULO DE MOSTSOLDFORMAT
        if (allCopiesSold!.length > 0) {
            const allFormats: string[] = []
            allCopiesSold!.forEach(copy => {
                for (let i = 0; i < copy.quantity; i++) {
                    allFormats.push(copy.format)
                }
            })
            mostSoldFormat.format = mostFrequentValue(allFormats)
            mostSoldFormat.percentage = Math.round(allFormats.reduce((sum, format) => format === mostSoldFormat.format ? sum + 1 : sum, 0) / allFormats.length * 100)
        }

        // CÁLCULO DE SALESFORMAT
        copiesThisMonth.forEach(copy => {
            salesFormat[copy.format] += copy.quantity
        })

        // CÁLCULO DE TOPPRODUCTS
        let allTitles: string[] = allCopiesSold!.map(copy => copy.product.title)
        let limit = 5
        while (limit > 0 && allTitles.length > 0) {
            const title = mostFrequentValue(allTitles)
            const sales = allTitles.reduce((sum, t) => t === title ? sum + 1 : sum, 0)
            topProducts.push({ title, sales })
            allTitles = allTitles.filter(t => t !== title)
            limit -= 1
        }

        // CÁLCULO DE MONTHLYLISTENERS
        monthlyListeners.thisMonth = await userDAO.getListenersOfArtist(artist!, new Date())
        const pastMonth = new Date()
        pastMonth.setMonth(pastMonth.getMonth() - 1)
        monthlyListeners.pastMonth = await userDAO.getListenersOfArtist(artist!, pastMonth)

        // FINAL RESPONSE
        const response = {
            copiesSold,
            releases,
            mostSoldFormat,
            salesFormat,
            topProducts,
            monthlyListeners
        }

        res.json({
            data: { ...response }
        })
    } catch (err) {
        console.log(err)
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
}