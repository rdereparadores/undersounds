import { AlbumDAO } from "../dao/AlbumDAO"
import { BaseUserDAO } from "../dao/BaseUserDAO"
import { UserDAO } from "../dao/UserDAO"
import { ArtistDAO } from "../dao/ArtistDAO"
import { GenreDAO } from "../dao/GenreDAO"
import { OrderDAO } from "../dao/OrderDAO"
import { ProductDAO } from "../dao/ProductDAO"
import { SongDAO } from "../dao/SongDAO"

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
