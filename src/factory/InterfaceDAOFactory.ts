import { AlbumDAO } from "../dao/AlbumDAO"
import { ArtistDAO } from "../dao/ArtistDAO"
import { BaseUserDAO } from "../dao/BaseUserDAO"
import { GenreDAO } from "../dao/GenreDAO"
import { OrderDAO } from "../dao/OrderDAO"
import { ProductDAO } from "../dao/ProductDAO"
import { SongDAO } from "../dao/SongDAO"
import { UserDAO } from "../dao/UserDAO"

export interface InterfaceDAOFactory {
    createBaseUserDAO(): BaseUserDAO
    createUserDAO(): UserDAO
    createArtistDAO(): ArtistDAO
    createProductDAO(): ProductDAO
    createSongDAO(): SongDAO
    createAlbumDAO(): AlbumDAO
    createGenreDAO(): GenreDAO
    createOrderDAO(): OrderDAO
    closeConnection(): Promise<boolean>
}
