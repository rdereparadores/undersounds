// import mongoose from "mongoose";
// import { IProductDAO } from "../dao/interfaces/IProductDAO";
// import { IAlbumDAO } from "../dao/interfaces/IAlbumDAO";
// import { ISongDAO } from "../dao/interfaces/ISongDAO";
// import { IGenreDAO } from "../dao/interfaces/IGenreDAO";
// import { IRatingDAO } from "../dao/interfaces/IRatingDAO";
// import { ProductDAO } from "../dao/mongo/ProductDAO";
// import { AlbumDAO } from "../dao/mongo/AlbumDAO";
// import { SongDAO } from "../dao/mongo/SongDAO";
// import { GenreDAO } from "../dao/mongo/GenreDAO";
// import { RatingDAO } from "../dao/mongo/RatingDAO";
//
// import { InterfaceDAOFactory } from "./InterfaceDAOFactory";
//
// export class MongoDBDAOFactory implements InterfaceDAOFactory {
//     private productDAO: IProductDAO;
//     private albumDAO: IAlbumDAO;
//     private songDAO: ISongDAO;
//     private genreDAO: IGenreDAO;
//     private ratingDAO: IRatingDAO;
//
//     constructor() {
//         if (process.env.DB_URI) {
//             mongoose.connect(process.env.DB_URI);
//             console.log('Connected to MongoDB');
//         } else {
//             throw new Error('ERROR: DB_URI not defined');
//         }
//
//         // Inicializar todos los DAOs
//         this.productDAO = new ProductDAO();
//         this.albumDAO = new AlbumDAO();
//         this.songDAO = new SongDAO();
//         this.genreDAO = new GenreDAO();
//         this.ratingDAO = new RatingDAO();
//     }
//
//     getProductDAO(): IProductDAO {
//         return this.productDAO;
//     }
//
//     getAlbumDAO(): IAlbumDAO {
//         return this.albumDAO;
//     }
//
//     getSongDAO(): ISongDAO {
//         return this.songDAO;
//     }
//
//     getGenreDAO(): IGenreDAO {
//         return this.genreDAO;
//     }
//
//     getRatingDAO(): IRatingDAO {
//         return this.ratingDAO;
//     }
//
//     async closeConnection() {
//         await mongoose.connection.close();
//         console.log('Disconnected from MongoDB');
//     }
// }