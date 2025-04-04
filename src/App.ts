import { MongoDBDAOFactory } from "./factory/MongoDBDAOFactory";
import express from 'express';
import cors from 'cors';
import { setupSwagger } from './swagger';
import routes from './routes';
import { errorHandler } from './middleware/ErrorMiddleware';

export class App {

    db: MongoDBDAOFactory;
    app: express.Express;

    constructor() {
        this.db = new MongoDBDAOFactory();
        this.app = express();

        this.middlewares();
        this.routes();
        this.setupSwagger();
        this.errorHandling();
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use((req, res, next) => {
            req.db = this.db;
            next();
        });
    }

    routes() {
        this.app.use('/api', routes);
    }

    setupSwagger() {
        setupSwagger(this.app);
    }

    errorHandling() {
        this.app.use(errorHandler);
    }

    listen() {
        const port = process.env.PORT || 3000;
        this.app.listen(port, () => {
            console.log(`Backend running at port ${port}`);
        });
    }
}