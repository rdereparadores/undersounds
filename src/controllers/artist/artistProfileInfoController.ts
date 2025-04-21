import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const profileArtistInfoController = async (req: express.Request, res: express.Response) => {
    const { artistUsername } = req.body

    try {
        if (!artistUsername) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }

        const artistDAO = req.db!.createArtistDAO()
        const genreDAO = req.db!.createGenreDAO()
        const songDAO = req.db!.createSongDAO()
        const albumDAO = req.db!.createAlbumDAO()

        const artist = await artistDAO.findByArtistUsername(artistUsername)
        if (!artist) {
            return res.status(Number(apiErrorCodes[3001].httpCode)).json({
                error: {
                    code: 3001,
                    message: apiErrorCodes[3001].message
                }
            })
        }
        const artistSongs = await songDAO.findByArtist(artist)
        const artistAlbums = await albumDAO.findByArtist(artist)

        const artistSongsPopulated = await Promise.all(artistSongs.map(async (song) => {
            const author = await artistDAO.findById(song.author)
            const collaborators = await Promise.all(song.collaborators.map(async (c) => await artistDAO.findById(c.artist)))
            const genres = await Promise.all(song.genres.map(async (genre) => await genreDAO.findById(genre)))
            return {
                _id: song._id,
                imgUrl: song.imgUrl,
                title: song.title,
                plays: song.plays,
                author: {
                    _id: author!._id,
                    artistName: author!.artistName,
                    artistUsername: author!.artistUsername
                },
                type: 'song',
                genres: genres.map(genre => genre!.genre),
                collaborators: collaborators.map(c => ({
                    _id: c!._id,
                    artistName: c!.artistName,
                    artistUsername: c!.artistUsername
                }))
            }
        }))

        const artistAlbumsPopulated = await Promise.all(artistAlbums.map(async (album) => {
            const author = await artistDAO.findById(album.author)
            const genres = await Promise.all(album.genres.map(async (genre) => await genreDAO.findById(genre)))
            return {
                _id: album._id,
                imgUrl: album.imgUrl,
                title: album.title,
                author: {
                    _id: author!._id,
                    artistName: author!.artistName,
                    artistUsername: author!.artistUsername
                },
                type: 'album',
                genres: genres.map(genre => genre!.genre),
                collaborators: []
            }
        }))

        const topSongs = artistSongsPopulated.sort((a, b) => b.plays - a.plays).slice(0, 4)

        const response = {
            artist: {
                _id: artist._id!,
                artistName: artist.artistName,
                artistUsername: artist.artistUsername,
                artistBannerUrl: artist.artistBannerUrl,
                artistImgUrl: artist.artistImgUrl,
                followers: artist.followerCount
            },
            topSongs,
            featuredRelease: topSongs[0], // TEMPORAL, CAMBIAR AL QUE HAYA ELEGIDO EL ARTISTA EN SU PERFIL
            albums: artistAlbumsPopulated,
            songs: artistSongsPopulated
        }

        return res.json({
            data: response
        })

    } catch {
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
}