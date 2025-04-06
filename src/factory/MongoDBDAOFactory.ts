import mongoose from 'mongoose';
import { AlbumDAO } from '../dao/AlbumDAO';
import { GenreDAO } from '../dao/GenreDAO';
import { ProductDAO } from '../dao/ProductDAO';
import { RatingDAO } from '../dao/RatingDAO';
import { SongDAO } from '../dao/SongDAO';

export class MongoDBDAOFactory {
    private connection: mongoose.Connection | null = null;
    private albumDAO: AlbumDAO | null = null;
    private genreDAO: GenreDAO | null = null;
    private productDAO: ProductDAO | null = null;
    private ratingDAO: RatingDAO | null = null;
    private songDAO: SongDAO | null = null;

    constructor() {
        this.connect();
    }

    private async connect(): Promise<void> {
        try {
            // Utilizar variable de entorno para la URL de conexión
            const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/undersounds';

            await mongoose.connect(mongoURI);

            this.connection = mongoose.connection;

            this.connection.on('error', (err) => {
                console.error('MongoDB connection error:', err);
            });

            this.connection.once('open', () => {
                console.log('MongoDB connected successfully');
            });
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }

    getAlbumDAO(): AlbumDAO {
        if (!this.albumDAO) {
            this.albumDAO = new AlbumDAO();
        }
        return this.albumDAO;
    }

    getGenreDAO(): GenreDAO {
        if (!this.genreDAO) {
            this.genreDAO = new GenreDAO();
        }
        return this.genreDAO;
    }

    getProductDAO(): ProductDAO {
        if (!this.productDAO) {
            this.productDAO = new ProductDAO();
        }
        return this.productDAO;
    }

    getRatingDAO(): RatingDAO {
        if (!this.ratingDAO) {
            this.ratingDAO = new RatingDAO();
        }
        return this.ratingDAO;
    }

    getSongDAO(): SongDAO {
        if (!this.songDAO) {
            this.songDAO = new SongDAO();
        }
        return this.songDAO;
    }

    async disconnect(): Promise<void> {
        if (this.connection) {
            await mongoose.disconnect();
            console.log('MongoDB disconnected');
        }
    }
}