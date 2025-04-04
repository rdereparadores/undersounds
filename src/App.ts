import { MongoDBDAOFactory } from "./factory/MongoDBDAOFactory";
import express from 'express'
import { checkoutRouter } from "./routes/checkoutRouter";

export class App {

    db: MongoDBDAOFactory
    app: express.Express

    constructor() {
        this.db = new MongoDBDAOFactory()
        this.app = express()

        this.middlewares()
        this.routes()
    }

    middlewares() {
        this.app.use((req, res, next) => {
            req.db = this.db
            next()
        })
        this.app.use(express.json())
    }

    routes() {
        this.app.use('/api/checkout', checkoutRouter)

    }

    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`Backend running at port ${process.env.PORT}`)
        })
    }
}