import { MongoDBDAOFactory } from "./factory/MongoDBDAOFactory";
import express from 'express'

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
        this.app.use((req: express.Request, res, next) => {
            req.db = this.db
            next()
        })
    }

    routes() {

    }

    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`Backend running at port ${process.env.PORT}`)
        })
    }
}