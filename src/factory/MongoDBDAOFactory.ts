import mongoose from "mongoose";
import { InterfaceDAOFactory } from "./InterfaceDAOFactory";

export class MongoDBDAOFactory implements InterfaceDAOFactory {
    constructor() {
        if (process.env.DB_URI) {
            mongoose.connect(process.env.DB_URI)
        } else {
            throw new Error('ERROR: DB_URI not defined')
        }
    }

    async closeConnection() {
        await mongoose.connection.close()
    }
}