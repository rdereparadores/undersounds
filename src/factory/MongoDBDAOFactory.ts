import mongoose from "mongoose";
import { InterfaceDAOFactory } from "./InterfaceDAOFactory";

export class MongoDBDAOFactory implements InterfaceDAOFactory {
    constructor() {
        try {
            mongoose.connect(process.env.DB_URI!)
        } catch (err) {
            console.log('Connection to DB failed:')
            console.log(err)
        }
    }

    createBaseUserDAO(): BaseUserDAO {
        
    }

    createUserDAO(): UserDAO {
        
    }

    createArtistDAO(): ArtistDAO {
        
    }

    createProductDAO(): ProductDAO {
        
    }

    createSongDAO(): SongDAO {
        
    }

    createAlbumDAO(): AlbumDAO {
        
    }

    createGenreDAO(): GenreDAO {
        
    }

    createRatingDAO(): RatingDAO {
        
    }

    createOrderDAO(): OrderDAO {
        
    }

    async closeConnection(): Promise<boolean> {
        try {
            await mongoose.disconnect()
            return true
        } catch (_err) {
            return false
        }
    }
}