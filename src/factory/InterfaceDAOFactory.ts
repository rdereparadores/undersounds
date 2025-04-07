export interface InterfaceDAOFactory {
    createBaseUserDAO(): BaseUserDAO
    createUserDAO(): UserDAO
    createArtistDAO(): ArtistDAO
    createProductDAO(): ProductDAO
    createSongDAO(): SongDAO
    createAlbumDAO(): AlbumDAO
    createGenreDAO(): GenreDAO
    createRatingDAO(): RatingDAO
    createOrderDAO(): OrderDAO
    closeConnection(): Promise<boolean>
}
