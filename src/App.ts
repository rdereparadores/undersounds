import { MongoDBDAOFactory } from "./factory/MongoDBDAOFactory"
import express from 'express'
import { aiRouter } from "./routes/aiRouter"
import { authRouter } from "./routes/authRouter"
import { authTokenMiddleware } from "./middleware/authTokenMiddleware"
import { genreRouter } from "./routes/genreRouter"
import { userRouter } from "./routes/userRouter"
import { artistRouter } from "./routes/artistRouter"
import {shopRouter} from "./routes/shopRouter";
import { checkArtistMiddleware } from "./middleware/checkArtistMiddleware"
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from "./utils/swaggerOptions"
import { trendingRouter } from "./routes/trendingRouter"
import { songRouter } from "./routes/songRouter"
import { checkoutRouter } from "./routes/checkoutRouter"
import { productRouter } from "./routes/productRouter"
import { albumRouter } from "./routes/albumRouter"
import { profileRouter } from "./routes/profileRouter"
import { otpRouter } from "./routes/otpRouter"

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
        this.app.use('/public', express.static('public/'))

        this.app.use((req, res, next) => {
            req.db = this.db
            next()
        })
        this.app.use(express.json())
    }

    routes() {
        this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
        
        this.app.use('/api/genre/', genreRouter)
        this.app.use('/api/ai/', authTokenMiddleware, aiRouter)
        this.app.use('/api/trending/', trendingRouter)
        this.app.use('/api/auth/', authRouter)
        this.app.use('/api/user/', authTokenMiddleware, userRouter)
        this.app.use('/api/artist/', authTokenMiddleware, checkArtistMiddleware, artistRouter)
        this.app.use('/api/profile/', profileRouter)
        this.app.use('/api/product/', productRouter)
        this.app.use('/api/song/', songRouter)
        this.app.use('/api/album/', albumRouter)
        this.app.use('/api/shop/', shopRouter)
        this.app.use('/api/checkout/', authTokenMiddleware, checkoutRouter)
        this.app.use('/api/otp', authTokenMiddleware, otpRouter)
        
        this.app.get('*', async (req, res) => {
            res.sendFile(`${process.cwd()}/src/views/index.html`, (err) => {
                if (err) {
                    res.status(500).send(err)
                }
            })
        })
    }

    listen() {
        const port = process.env.PORT || 3000
        this.app.listen(port, () => {
            console.log(`Backend running at port ${port}`)
        });
    }
}