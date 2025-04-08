import { MongoDBDAOFactory } from "./factory/MongoDBDAOFactory"
import express from 'express'
import { aiRouter } from "./routes/aiRouter"
import { authRouter } from "./routes/authRouter"
import { authTokenMiddleware } from "./middleware/authTokenMiddleware"
import { genreRouter } from "./routes/genreRouter"

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
        })
        this.app.use(express.json())
    }

    routes() {
        this.app.use('/api/genre/', genreRouter)
        this.app.use('/api/ai/', aiRouter)
        this.app.use('/api/auth/', authRouter)
    }

    listen() {
        const port = process.env.PORT || 3000
        this.app.listen(port, () => {
            console.log(`Backend running at port ${port}`)
        });
    }
}