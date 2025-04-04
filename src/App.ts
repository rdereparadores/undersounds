import { MongoDBDAOFactory } from "./factory/MongoDBDAOFactory"
import express from 'express'
import routes from './routes'
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
        this.app.use('/', express.static('src/views'))
        this.app.use((req, res, next) => {
            req.db = this.db
            next()
        });
    }

    routes() {
        this.app.use('/api', routes)
    }

    listen() {
        const port = process.env.PORT || 3000
        this.app.listen(port, () => {
            console.log(`Backend running at port ${port}`)
        });
    }
}