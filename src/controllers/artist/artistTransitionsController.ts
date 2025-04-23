import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const artistTransactionsController = async (req: express.Request, res: express.Response) => {
    try {
        const artistDAO = req.db!.createArtistDAO()
        const orderDAO  = req.db!.createOrderDAO()

        const artist = await artistDAO.findByUid(req.uid!)
        if (!artist) {
            return res.status(404).json({
                error: { code: 4004, message: 'Artista no encontrado' }
            })
        }

        const itemsSold = await orderDAO.findItemsSoldByArtist(artist)
        if (!itemsSold) {
            return res.json({ data: [] })
        }

        const transactions = itemsSold.flatMap(line =>
            Array.from({ length: line.quantity }, (_, i) => {
                const date    = new Date(line.purchaseDate)
                const price   = line.price
                const earning = price * 0.7

                return {
                    id:           `${line.product._id}-${date.getTime()}-${i}`,
                    productTitle: line.product.title,
                    format:       line.format as 'digital'|'cd'|'vinyl'|'cassette',
                    amount:       price,
                    earning,
                    date,
                    imgUrl:       line.product.imgUrl || '/uploads/song/cover/generic.jpg'
                }
            })
        )

        transactions.sort((a, b) => b.date.getTime() - a.date.getTime())

        return res.json({ data: transactions })

    } catch (err) {
        console.error("artistTransactionsController:", err)
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code:    2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
}
