import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'
import { mostFrequentValue } from '../../utils/mostFrequentValue'

export const userStatsController = async (req: express.Request, res: express.Response) => {
    try {
        const userDAO = req.db!.createBaseUserDAO()
        const artistDAO = req.db!.createArtistDAO()
        const genreDAO = req.db!.createGenreDAO()
        const songDAO = req.db!.createSongDAO()
        const orderDAO = req.db!.createOrderDAO()
        const user = await userDAO.findByUid(req.uid!)
        const orders = await orderDAO.findOrdersFromUser(user!)

        const listeningTime = { thisMonth: -1, pastMonth: -1 }
        const preferredFormat = { format: 'N/A', percentage: -1 }
        const preferredGenre = { thisMonth: 'N/A', pastMonth: 'N/A' }
        const mostListenedArtist = { thisMonth: { artistName: 'N/A', percentage: -1 } }
        const artistBadge = { artistName: 'N/A', artistImgUrl: 'N/A', percentile: -1 }
        const ordersFormat = { digital: 0, cd: 0, vinyl: 0, cassette: 0 }
        const topArtists: { artistName: string, plays: number }[] = []

        const listeningHistoryPopulated = await Promise.all(user!.listeningHistory.map(async (item) => {
            const song = await songDAO.findById(item.song)
            if (!song) throw new Error()
            const author = await artistDAO.findById(song.author)
            if (!author) throw new Error()

            const genres = await Promise.all(song.genres.map(async (genreId) => {
                const genre = await genreDAO.findById(genreId)
                if (!genre) throw new Error()
                return genre
            }))

            const collaborators = await Promise.all(song.collaborators.map(async (collaborator) => {
                const artist = await artistDAO.findById(collaborator.artist)
                if (!artist) throw new Error()
                return artist
            }))

            return {
                ...item,
                song: {
                    ...song,
                    author,
                    genres,
                    collaborators
                }
            }
        }))
        const historyThisMonth = listeningHistoryPopulated.filter(item => {
            const playedAt = new Date(item.playedAt)
            const now = new Date()
            return playedAt.getMonth() === now.getMonth() && playedAt.getFullYear() === now.getFullYear()
        })
        const historyPastMonth = listeningHistoryPopulated.filter(item => {
            const playedAt = new Date(item.playedAt)
            const now = new Date()
            const pastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            return playedAt.getMonth() === pastMonth.getMonth() && playedAt.getFullYear() === pastMonth.getFullYear()
        })

        // CÁLCULO DE LISTENINGTIME
        if (historyThisMonth.length > 0 || historyPastMonth.length > 0) {
            const minutesThisMonth = historyThisMonth.reduce((total, item) => {
                return total + (item.song.duration / 60)
            }, 0)

            const minutesPastMonth = historyPastMonth.reduce((total, item) => {
                return total + (item.song.duration / 60)
            }, 0)

            listeningTime.thisMonth = Math.round(minutesThisMonth)
            listeningTime.pastMonth = Math.round(minutesPastMonth)
        }

        // CÁLCULO DE PREFERREDGENRE
        if (historyThisMonth.length > 0) {
            const genresThisMonth: string[] = []
            historyThisMonth.forEach(item => item.song.genres.forEach(genre => genresThisMonth.push(genre.genre)))
            preferredGenre.thisMonth = mostFrequentValue(genresThisMonth)
        }
        if (historyPastMonth.length > 0) {
            const genresPastMonth: string[] = []
            historyPastMonth.forEach(item => item.song.genres.forEach(genre => genresPastMonth.push(genre.genre)))
            preferredGenre.pastMonth = mostFrequentValue(genresPastMonth)
        }

        // CÁLCULO DE MOSTLISTENEDARTIST
        if (historyThisMonth.length > 0) {
            const artistsThisMonth: string[] = []
            historyThisMonth.forEach(item => {
                artistsThisMonth.push(item.song.author.artistName)
                item.song.collaborators.forEach(collaborator => artistsThisMonth.push(collaborator.artistName))
            })
            mostListenedArtist.thisMonth.artistName = mostFrequentValue(artistsThisMonth)
            const count = artistsThisMonth.reduce((sum, item) => (
                item === mostListenedArtist.thisMonth.artistName ? sum + 1 : sum
            ), 0)
            mostListenedArtist.thisMonth.percentage = Math.round(count / artistsThisMonth.length * 100)
        }

        // CÁLCULO DE TOPARTISTS
        if (listeningHistoryPopulated.length > 0) {
            let artistsOverall: string[] = []
            listeningHistoryPopulated.forEach(item => {
                artistsOverall.push(item.song.author.artistName)
                item.song.collaborators.forEach(collaborator => artistsOverall.push(collaborator.artistName))
            })
            let topLimit = 5
            while (topLimit > 0 && artistsOverall.length > 0) {
                const artist = mostFrequentValue(artistsOverall)
                const playCount = artistsOverall.reduce((sum, item) => (
                    item === artist ? sum + 1 : sum
                ), 0)
                topArtists.push({
                    artistName: artist,
                    plays: playCount
                })
                artistsOverall = artistsOverall.filter(item => item !== artist)
                topLimit -= 1
            }
        }

        // CÁLCULO DE PREFERREDFORMAT Y ORDERSFORMAT
        if (orders.length > 0) {
            const formats: string[] = []
            orders.forEach(order => {
                order.lines.forEach(line => {
                    formats.push(line.format)
                    ordersFormat[line.format] += 1
                })
            })
            preferredFormat.format = mostFrequentValue(formats)
            const count = formats.reduce((sum, item) => (
                item === preferredFormat.format ? sum + 1 : sum
            ), 0)
            preferredFormat.percentage = Math.round(count / formats.length * 100)
        }

        // CÁLCULO DE ARTISTBADGE
        // PRINCIPIO DE PARETO
        if (listeningHistoryPopulated.length > 0) {
            const artistsRepeated: string[] = []
            const artists: string[] = []
            listeningHistoryPopulated.forEach(item => {
                artistsRepeated.push(item.song.author._id!)
                if (artists.find(id => id === item.song.author._id!) === undefined) {
                    artists.push(item.song.author._id!)
                }
                item.song.collaborators.forEach(collaborator => {
                    artistsRepeated.push(collaborator._id!)
                    if (artists.find(id => id === collaborator._id!) === undefined) {
                        artists.push(collaborator._id!)
                    }
                })
            })

            const artistPercentiles: { artist: string, percentile: number }[] = []

            await Promise.all(artists.map(async (artistId) => {
                const myPlays = artistsRepeated.reduce((sum, artist) => artist === artistId ? sum + 1 : sum, 0)
                const alpha = 1.2
                const percentile = 100 * (1 - Math.pow(1 / myPlays, alpha))
                artistPercentiles.push({ artist: artistId, percentile })
            }))

            const bestPercentile = artistPercentiles.sort((a, b) => {
                return b.percentile - a.percentile
            })[0]
            
            const artist = await artistDAO.findById(bestPercentile.artist)
            artistBadge.artistImgUrl = artist!.artistImgUrl
            artistBadge.artistName = artist!.artistName
            artistBadge.percentile = Math.round(bestPercentile.percentile)
        }


        // FINAL RESPONSE
        const response = {
            listeningTime,
            preferredGenre,
            mostListenedArtist,
            topArtists,
            preferredFormat,
            ordersFormat,
            artistBadge,
        }

        res.json({
            data: { ...response }
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