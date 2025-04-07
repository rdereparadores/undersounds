import mongoose from 'mongoose';
import { AlbumDAO } from '../dao/AlbumDAO';
import { GenreDAO } from '../dao/GenreDAO';
import { ProductDAO } from '../dao/ProductDAO';
import { SongDAO } from '../dao/SongDAO';
import { InterfaceDAOFactory } from './InterfaceDAOFactory';
import { BaseUserDAO } from '../dao/BaseUserDAO';
import { UserDAO } from '../dao/UserDAO';
import { ArtistDAO } from '../dao/ArtistDAO';
import { OrderDAO } from '../dao/OrderDAO';

export class MongoDBDAOFactory implements InterfaceDAOFactory {
    constructor() {
        this.connect()
    }

    private async connect(): Promise<void> {
        try {
            mongoose.connect(process.env.DB_URI!)
            mongoose.connection.once('open', () => {
                console.log('MongoDB connected successfully');
            })
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }

    createBaseUserDAO() {
        return new BaseUserDAO()
    }

    createUserDAO() {
        return new UserDAO()
    }

    createArtistDAO() {
        return new ArtistDAO()
    }

    createProductDAO() {
        return new ProductDAO()
    }

    createSongDAO() {
        return new SongDAO()
    }

    createAlbumDAO() {
        return new AlbumDAO()
    }

    createGenreDAO() {
        return new GenreDAO()
    }

    createOrderDAO() {
        return new OrderDAO()
    }

    async closeConnection() {
        try {
            await mongoose.disconnect()
            return true
        } catch (_err) {
            return false
        }
    }
}