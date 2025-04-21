import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

interface ReleaseItem {
    id: string;
    title: string;
    imgUrl: string;
    artist: string;
    artistId: string;
    releaseDate: Date;
    type: string;
}

export const artistProfileInfoController = async (req: express.Request, res: express.Response) => {
    const { artistId } = req.body

    try {
        if (!artistId) {
            return res.status(Number(apiErrorCodes[3000].httpCode)).json({
                error: {
                    code: 3000,
                    message: apiErrorCodes[3000].message
                }
            })
        }

        const artistDAO = req.db!.createArtistDAO()
        const songDAO = req.db!.createSongDAO()
        const albumDAO = req.db!.createAlbumDAO()
        const userDAO = req.db!.createBaseUserDAO()

        const artist = await artistDAO.findById(artistId)
        if (!artist) {
            return res.status(Number(apiErrorCodes[3001].httpCode)).json({
                error: {
                    code: 3001,
                    message: apiErrorCodes[3001].message
                }
            })
        }

        const currentUser = await userDAO.findByUid(req.uid!)
        const followed = currentUser!.following.includes(artistId)

        const albumDocs = await albumDAO.findByArtist({ _id: artistId })
        const albums: ReleaseItem[] = albumDocs.map(album => ({
            id: album._id!,
            title: album.title,
            imgUrl: album.imgUrl,
            artist: artist.artistName,
            artistId: artist._id!,
            releaseDate: album.releaseDate,
            type: album.trackList.length <= 4 ? 'EP' : 'Album'
        }))

        const songs = await songDAO.findByArtist({ _id: artistId })

        const topSongs = await Promise.all(
            songs
                .sort((a, b) => b.plays - a.plays)
                .slice(0, 5)
                .map(async (song) => {
                    const containingAlbum = albumDocs.find(album =>
                        album.trackList.some(trackId => trackId.toString() === song._id!.toString())
                    )

                    const mainArtistInfo = {
                        name: artist.artistName,
                        artistId: artist._id!
                    }

                    const collaborators = await Promise.all(song.collaborators
                        .filter(c => c.accepted)
                        .map(async (collab) => {
                            const collabArtist = await artistDAO.findById(collab.artist)
                            return {
                                name: collabArtist!.artistName,
                                artistId: collabArtist!._id!
                            }
                        })
                    )

                    const artists = [mainArtistInfo, ...collaborators]

                    return {
                        id: song._id!,
                        songName: song.title,
                        imgURL: song.imgUrl,
                        artists: artists,
                        album: containingAlbum ? containingAlbum.title : 'Single',
                        albumId: containingAlbum ? containingAlbum._id! : null,
                        plays: song.plays
                    }
                })
        )

        const uniqueSinglesMap = new Map<string, ReleaseItem>()

        songs
            .filter(song =>
                !albumDocs.some(album =>
                    album.trackList.some(trackId => trackId.toString() === song._id!.toString())
                )
            )
            .forEach(song => {
                if (!uniqueSinglesMap.has(song._id!)) {
                    uniqueSinglesMap.set(song._id!, {
                        id: song._id!,
                        title: song.title,
                        imgUrl: song.imgUrl,
                        artist: artist.artistName,
                        artistId: artist._id!,
                        releaseDate: song.releaseDate,
                        type: 'Single'
                    })
                }
            })

        albumDocs
            .filter(album => album.trackList.length <= 4)
            .forEach(album => {
                album.trackList.forEach(trackId => {
                    const song = songs.find(s => s._id!.toString() === trackId.toString())
                    if (song && !uniqueSinglesMap.has(song._id!)) {
                        uniqueSinglesMap.set(song._id!, {
                            id: song._id!,
                            title: song.title,
                            imgUrl: song.imgUrl,
                            artist: artist.artistName,
                            artistId: artist._id!,
                            releaseDate: song.releaseDate,
                            type: 'Single'
                        })
                    }
                })
            })

        const epsYsingles: ReleaseItem[] = [
            ...albums.filter(album => album.type === 'EP'),
            ...Array.from(uniqueSinglesMap.values())
        ]

        const allReleases: ReleaseItem[] = [...albums, ...epsYsingles]
        const newestRelease = allReleases.length > 0
            ? allReleases.reduce((latest, current) =>
                (!latest || current.releaseDate > latest.releaseDate) ? current : latest
            )
            : null

        const profileData = {
            artist: {
                id: artist._id!,
                name: artist.artistName,
                artistUsername: artist.artistUsername,
                followed,
                bannerImgUrl: artist.artistBannerUrl,
                profileImgUrl: artist.artistImgUrl
            },
            topSongs,
            newestRelease: newestRelease ? {
                ...newestRelease,
                releaseYear: newestRelease.releaseDate.getFullYear()
            } : null,
            albums: albums.filter(album => album.type === 'Album'),
            epsYsingles
        }
        console.log("Artist profile data:", profileData)
        res.json({
            data: profileData
        })
    } catch (error) {
        console.error('Error in artist profile info:', error)
        return res.status(Number(apiErrorCodes[2000].httpCode)).json({
            error: {
                code: 2000,
                message: apiErrorCodes[2000].message
            }
        })
    }
}