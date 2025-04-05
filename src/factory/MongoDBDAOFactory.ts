/*import mongoose from "mongoose";
import { IUserDAO } from "../dao/interfaces/IUserDAO";
import { IArtistDAO } from "../dao/interfaces/IArtistDAO";
import { IProductDAO } from "../dao/interfaces/IProductDAO";
import { IAlbumDAO } from "../dao/interfaces/IAlbumDAO";
import { ISongDAO } from "../dao/interfaces/ISongDAO";
import { IGenreDAO } from "../dao/interfaces/IGenreDAO";
import { IOrderDAO } from "../dao/interfaces/IOrderDAO";
import { IRatingDAO } from "../dao/interfaces/IRatingDAO";
import { UserDAO } from "../dao/mongo/UserDAO";
import { ArtistDAO } from "../dao/mongo/ArtistDAO";
import { ProductDAO } from "../dao/mongo/ProductDAO";
import { AlbumDAO } from "../dao/mongo/AlbumDAO";
import { SongDAO } from "../dao/mongo/SongDAO";
import { GenreDAO } from "../dao/mongo/GenreDAO";
import { OrderDAO } from "../dao/mongo/OrderDAO";
import { RatingDAO } from "../dao/mongo/RatingDAO";
*/

import { InterfaceDAOFactory } from "./InterfaceDAOFactory";

export class MongoDBDAOFactory implements InterfaceDAOFactory {
/*
    private userDAO: IUserDAO;
    private artistDAO: IArtistDAO;
    private productDAO: IProductDAO;
    private albumDAO: IAlbumDAO;
    private songDAO: ISongDAO;
    private genreDAO: IGenreDAO;
    private orderDAO: IOrderDAO;
    private ratingDAO: IRatingDAO;

    constructor() {
        if (process.env.DB_URI) {
            mongoose.connect(process.env.DB_URI);
            console.log('Connected to MongoDB');
        } else {
            throw new Error('ERROR: DB_URI not defined');
        }

        // Inicializar todos los DAOs
        this.userDAO = new UserDAO();
        this.artistDAO = new ArtistDAO();
        this.productDAO = new ProductDAO();
        this.albumDAO = new AlbumDAO();
        this.songDAO = new SongDAO();
        this.genreDAO = new GenreDAO();
        this.orderDAO = new OrderDAO();
        this.ratingDAO = new RatingDAO();
    }

    getUserDAO(): IUserDAO {
        return this.userDAO;
    }

    getArtistDAO(): IArtistDAO {
        return this.artistDAO;
    }

    getProductDAO(): IProductDAO {
        return this.productDAO;
    }

    getAlbumDAO(): IAlbumDAO {
        return this.albumDAO;
    }

    getSongDAO(): ISongDAO {
        return this.songDAO;
    }

    getGenreDAO(): IGenreDAO {
        return this.genreDAO;
    }

    getOrderDAO(): IOrderDAO {
        return this.orderDAO;
    }

    getRatingDAO(): IRatingDAO {
        return this.ratingDAO;
    }

    async closeConnection() {
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
    */
}

// -- DESCOMENTAR CUANDO ESTE TODO IMPLEMENTADO