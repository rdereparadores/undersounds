import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';
import {UserDAO} from "../../dao/UserDAO";

/**
 * @desc    Get user dashboard statistics
 * @route   GET /api/user/stats
 * @access  Private
 */
export const userStatsController = async (req: Request, res: Response) => {
    try {
        const uid = req.body.uid;

        if (!uid || typeof uid !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'User ID is required',
                    code: 'USER_ID_REQUIRED'
                }
            });
        }

        const factory = new MongoDBDAOFactory();
        const userDAO = factory.createBaseUserDAO();
        const user = await userDAO.findByUid(uid);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'User not found',
                    code: 'USER_NOT_FOUND'
                }
            });
        }

        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const listeningHistory = user.listening_history || [];

        const currentMonthHistory = listeningHistory.filter(entry => {
            const playedAt = new Date(entry.played_at);
            return playedAt >= currentMonthStart && playedAt <= now;
        });

        const previousMonthHistory = listeningHistory.filter(entry => {
            const playedAt = new Date(entry.played_at);
            return playedAt >= previousMonthStart && playedAt <= previousMonthEnd;
        });

        const songDAO = factory.createSongDAO();

        const songDurations = new Map();
        const songCollaborators = new Map();

        const allSongIds = [...new Set([
            ...currentMonthHistory.map(entry => entry.song),
            ...previousMonthHistory.map(entry => entry.song)
        ])];

        const songsPromises = allSongIds.map(songId => songDAO.findById(songId));
        const allUniqueSongs = (await Promise.all(songsPromises)).filter(Boolean);

        const collaboratorsPromises = allSongIds.map(songId => songDAO.getCollaborators(songId));
        const allCollaborators = await Promise.all(collaboratorsPromises);

        for (let i = 0; i < allSongIds.length; i++) {
            if (allCollaborators[i]) {
                songCollaborators.set(allSongIds[i], allCollaborators[i]);
            }
        }

        const songGenres = new Map();
        const songArtists = new Map();

        allUniqueSongs.forEach(song => {
            if (song && song._id) {
                songDurations.set(song._id, song.duration);
                songGenres.set(song._id, song.genres);
                songArtists.set(song._id, song.author);
            }
        });

        const monthListening = await calculateListeningTime(
            currentMonthHistory,
            previousMonthHistory,
            songDurations)

        const orderDAO = factory.createOrderDAO();
        const orders = await orderDAO.getOrdersFromUser(user) || [];
        const formatStats = calculatePreferredFormat(orders);

        const genreDAO = factory.createGenreDAO();

        const currentMonthGenreCounts: Record<string, number> = {};
        for (const entry of currentMonthHistory) {
            const genres = songGenres.get(entry.song) || [];
            for (const genreId of genres) {
                currentMonthGenreCounts[genreId] = (currentMonthGenreCounts[genreId] || 0) + 1;
            }
        }

        const previousMonthGenreCounts: Record<string, number> = {};
        for (const entry of previousMonthHistory) {
            const genres = songGenres.get(entry.song) || [];
            for (const genreId of genres) {
                previousMonthGenreCounts[genreId] = (previousMonthGenreCounts[genreId] || 0) + 1;
            }
        }

        let currentMonthTopGenreId = '';
        let currentMonthMaxCount = 0;
        for (const [genreId, count] of Object.entries(currentMonthGenreCounts)) {
            if (count > currentMonthMaxCount) {
                currentMonthMaxCount = count;
                currentMonthTopGenreId = genreId;
            }
        }

        let previousMonthTopGenreId = '';
        let previousMonthMaxCount = 0;
        for (const [genreId, count] of Object.entries(previousMonthGenreCounts)) {
            if (count > previousMonthMaxCount) {
                previousMonthMaxCount = count;
                previousMonthTopGenreId = genreId;
            }
        }

        const currentMonthGenre = currentMonthTopGenreId ?
            await genreDAO.findById(currentMonthTopGenreId) : null;
        const previousMonthGenre = previousMonthTopGenreId ?
            await genreDAO.findById(previousMonthTopGenreId) : null;

        const artistDAO = factory.createArtistDAO();

        const artistPlays: Record<string, number> = {};
        const artistListeningTime: Record<string, number> = {};

        for (const entry of listeningHistory) {
            const songId = entry.song;
            const duration = songDurations.get(songId) || 0;

            const artistId = songArtists.get(songId);
            if (artistId) {
                artistPlays[artistId] = (artistPlays[artistId] || 0) + 1;
                artistListeningTime[artistId] = (artistListeningTime[artistId] || 0) + duration;
            }

            const collaborators = songCollaborators.get(songId) || [];
            for (const collab of collaborators) {
                if (collab.accepted) {
                    artistPlays[collab.artist] = (artistPlays[collab.artist] || 0) + 1;
                    artistListeningTime[collab.artist] = (artistListeningTime[collab.artist] || 0) + duration;
                }
            }
        }

        const sortedArtists = Object.entries(artistPlays)
            .sort((a, b) => b[1] - a[1]);

        const topArtistsData = [];
        const topArtistIds = sortedArtists.slice(0, 5).map(entry => entry[0]);
        const topArtistsPromises = topArtistIds.map(artistId => artistDAO.findById(artistId));
        const topArtistsResults = await Promise.all(topArtistsPromises);

        const totalPlays = listeningHistory.length;
        const topArtistPlayCount = sortedArtists[0][1] || 0;

        const topArtist = topArtistsResults[0];
        const topArtistPercentage = totalPlays > 0
            ? Math.round((topArtistPlayCount / totalPlays) * 100)
            : 0;
        const topArtistUid = topArtist?.uid

        const topArtistListeningTime = artistListeningTime[topArtistUid!] || 0;
        const topArtistBadge = topArtistUid
            ? await calculateArtistBadge(factory, topArtistUid, uid, topArtistListeningTime / 60)
            : null;

        for (let i = 0; i < topArtistsResults.length; i++) {
            const artist = topArtistsResults[i];
            if (artist) {
                topArtistsData.push({
                    artist: artist.artist_name,
                    plays: sortedArtists[i][1]
                });
            }
        }

        const response = {
            listeningTime: {
                currentMonth: {
                    minutes: monthListening.current,
                    changePercentage: monthListening.listeningPercentage
                }
            },
            preferredFormat: {
                topFormat: formatStats.preferredFormat,
                ratio: formatStats.ratio,
                formatDistribution: formatStats.formatDistribution
            },
            genreStats: {
                currentMonth: currentMonthGenre?.genre || 'Rock',
                previousMonth: previousMonthGenre?.genre || 'Pop'
            },
            artistStats: {
                mostListened: {
                    artist: topArtist?.artist_name || 'N/A',
                    percentage: topArtistPercentage,
                },
                topArtists: topArtistsData,
                artistBadge: topArtistBadge
            }
        };

        res.status(200).json({
            success: true,
            msg: 'User statistics retrieved successfully',
            data: response
        });
    } catch (error) {
        console.error('Error in userStatsController:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        res.status(500).json({
            success: false,
            error: {
                message: errorMessage,
                code: 'STATS_FETCH_ERROR'
            }
        });
    }
};

interface calculateListeningTimeOut {
    current: number;
    previous: number;
    listeningPercentage: number;
}

async function calculateListeningTime(
    currentMonthHistory : {
        song: string,
        played_at: Date
    }[],
    previousMonthHistory : {
        song: string,
        played_at: Date
    }[],
    songDurations : Map<string, number>
    ) : Promise<calculateListeningTimeOut> {
    const current = Math.round(
        currentMonthHistory.reduce((total, entry) => {
            const duration = songDurations.get(entry.song) || 0;
            return total + (duration / 60);
        }, 0)
    );

    const previous = Math.round(
        previousMonthHistory.reduce((total, entry) => {
            const duration = songDurations.get(entry.song) || 0;
            return total + (duration / 60);
        }, 0)
    );

    const listeningPercentage = previous > 0
        ? Math.round(((current - previous) / previous) * 100)
        : 100;
    return {
        current,
        previous,
        listeningPercentage
    };
}

async function calculateArtistBadge(
    factory: MongoDBDAOFactory,
    artistId: string,
    userId: string,
    userListeningTimeMinutes?: number
) {
    if (!artistId || !userId) {
        return {
            artist: 'N/A',
            userListeningTime: 0,
            totalListeningTime: 0,
            percentile: 0,
            badge: 'Sin datos suficientes'
        };
    }

    try {
        const artistDAO = factory.createArtistDAO();
        const artist = await artistDAO.findByUid(artistId);
        if (!artist) {
            return {
                artist: 'Artista desconocido',
                userListeningTime: userListeningTimeMinutes || 0,
                totalListeningTime: 0,
                percentile: 0,
                badge: 'Sin datos suficientes'
            };
        }

        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const userDAO = factory.createUserDAO();

        const userRankInfo = await userDAO.getUserRankForArtist(artistId, userId, currentMonthStart);

        const userTime = userListeningTimeMinutes !== undefined
            ? userListeningTimeMinutes
            : userRankInfo.userListeningTime;

        let percentile = 0;
        if (userRankInfo.totalFans > 0) {
            percentile = Math.round((1 - (userRankInfo.rank / userRankInfo.totalFans)) * 100);
        }

        const badge = percentile > 0
            ? `Estás en el top ${percentile}% de oyentes`
            : 'Sin datos suficientes';

        return {
            artist: artist.artist_name,
            userListeningTime: Math.round(userTime),
            totalListeningTime: Math.round(userRankInfo.artistTotalListeningTime),
            percentile: percentile,
            badge: badge
        };
    } catch (error) {
        console.error('Error calculando la insignia del artista:', error);
        return {
            artist: 'Error',
            userListeningTime: 0,
            totalListeningTime: 0,
            percentile: 0,
            badge: 'Error al calcular'
        };
    }
}

function calculatePreferredFormat(orders: import('../../dto/OrderDTO').OrderDTO[]): {
    preferredFormat: string;
    ratio: string;
    formatDistribution: { format: string; quantity: number; fill: string }[];
} {
    const formatCounts: Record<string, number> = {
        digital: 0,
        cd: 0,
        vinyl: 0,
        cassette: 0
    };

    orders.forEach(order => {
        order.lines.forEach(line => {
            if (formatCounts[line.format] !== undefined) {
                formatCounts[line.format] += line.quantity;
            }
        });
    });

    let preferredFormat = 'digital';
    let maxCount = 0;

    for (const [format, count] of Object.entries(formatCounts)) {
        if (count > maxCount) {
            maxCount = count;
            preferredFormat = format;
        }
    }

    const totalPurchases = Object.values(formatCounts).reduce((sum, count) => sum + count, 0);

    const formatDistribution = Object.entries(formatCounts).map(([format, quantity]) => ({
        format,
        quantity,
        fill: `var(--color-${format})`
    }));

    const ratio = totalPurchases > 0
        ? `${Math.round((formatCounts[preferredFormat] / totalPurchases) * 10)} de cada 10 compras`
        : 'No hay compras';

    return {
        preferredFormat,
        ratio,
        formatDistribution
    };
}