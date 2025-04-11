import { Request, Response } from 'express';
import { MongoDBDAOFactory } from '../../factory/MongoDBDAOFactory';
import { OrderDTO } from '../../dto/OrderDTO';

interface ListeningHistoryEntry {
    song: string;
    played_at: Date;
}

interface ListeningTimeStats {
    current: number;
    previous: number;
    listeningPercentage: number;
}

interface FormatStats {
    preferredFormat: string;
    ratio: string;
    formatDistribution: { format: string; quantity: number}[];
}

interface ArtistBadge {
    artist: string;
    userListeningTime: number;
    totalListeningTime: number;
    percentile: number;
}

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
        const user = await getUserFromUid(factory, uid);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'User not found',
                    code: 'USER_NOT_FOUND'
                }
            });
        }

        const { currentMonthHistory, previousMonthHistory, listeningHistory } =
            getFilteredListeningHistory(user.listening_history || []);

        const songDAO = factory.createSongDAO();

        const allSongIds = [...new Set([
            ...currentMonthHistory.map(entry => entry.song),
            ...previousMonthHistory.map(entry => entry.song)
        ])];

        const {
            songDurations,
            songGenres,
            songArtists,
            songCollaborators
        } = await loadSongsData(songDAO, allSongIds);

        const monthListening = calculateListeningTime(
            currentMonthHistory,
            previousMonthHistory,
            songDurations
        );

        const orderDAO = factory.createOrderDAO();
        const orders = await orderDAO.getOrdersFromUser(user) || [];
        const formatStats = calculatePreferredFormat(orders);

        const genreStats = await calculateGenreStats(
            factory,
            currentMonthHistory,
            previousMonthHistory,
            songGenres
        );

        const artistStats = await calculateArtistStats(
            factory,
            listeningHistory,
            songDurations,
            songArtists,
            songCollaborators,
            uid
        );

        const response = {
            listeningTime: {
                currentMonth: {
                    minutes: monthListening.current,
                    changePercentage: monthListening.listeningPercentage
                }
            },
            preferredFormat: formatStats,
            genreStats,
            artistStats
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

async function getUserFromUid(factory: MongoDBDAOFactory, uid: string) {
    const userDAO = factory.createBaseUserDAO();
    return await userDAO.findByUid(uid);
}

function getFilteredListeningHistory(listeningHistory: any[]) {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const currentMonthHistory = listeningHistory.filter(entry => {
        const playedAt = new Date(entry.played_at);
        return playedAt >= currentMonthStart && playedAt <= now;
    });

    const previousMonthHistory = listeningHistory.filter(entry => {
        const playedAt = new Date(entry.played_at);
        return playedAt >= previousMonthStart && playedAt <= previousMonthEnd;
    });

    return {
        currentMonthHistory,
        previousMonthHistory,
        listeningHistory
    };
}

async function loadSongsData(songDAO: any, allSongIds: string[]) {
    const songDurations = new Map();
    const songGenres = new Map();
    const songArtists = new Map();
    const songCollaborators = new Map();

    const songsPromises = allSongIds.map(songId => songDAO.findById(songId));
    const allUniqueSongs = (await Promise.all(songsPromises)).filter(Boolean);

    const collaboratorsPromises = allSongIds.map(songId => songDAO.getCollaborators(songId));
    const allCollaborators = await Promise.all(collaboratorsPromises);

    for (let i = 0; i < allSongIds.length; i++) {
        if (allCollaborators[i]) {
            songCollaborators.set(allSongIds[i], allCollaborators[i]);
        }
    }

    allUniqueSongs.forEach(song => {
        if (song && song._id) {
            songDurations.set(song._id, song.duration);
            songGenres.set(song._id, song.genres);
            songArtists.set(song._id, song.author);
        }
    });

    return {
        songDurations,
        songGenres,
        songArtists,
        songCollaborators
    };
}

function calculateListeningTime(
    currentMonthHistory: ListeningHistoryEntry[],
    previousMonthHistory: ListeningHistoryEntry[],
    songDurations: Map<string, number>
): ListeningTimeStats {
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

async function calculateGenreStats(
    factory: MongoDBDAOFactory,
    currentMonthHistory: ListeningHistoryEntry[],
    previousMonthHistory: ListeningHistoryEntry[],
    songGenres: Map<string, string[]>
) {
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

    const currentMonthTopGenreId = findMostPopularGenre(currentMonthGenreCounts);

    const previousMonthTopGenreId = findMostPopularGenre(previousMonthGenreCounts);

    const currentMonthGenre = currentMonthTopGenreId ?
        await genreDAO.findById(currentMonthTopGenreId) : null;
    const previousMonthGenre = previousMonthTopGenreId ?
        await genreDAO.findById(previousMonthTopGenreId) : null;

    return {
        currentMonth: currentMonthGenre?.genre || 'N/A',
        previousMonth: previousMonthGenre?.genre || 'N/A'
    };
}

function findMostPopularGenre(genreCounts: Record<string, number>): string {
    let topGenreId = '';
    let maxCount = 0;

    for (const [genreId, count] of Object.entries(genreCounts)) {
        if (count > maxCount) {
            maxCount = count;
            topGenreId = genreId;
        }
    }

    return topGenreId;
}

async function calculateArtistStats(
    factory: MongoDBDAOFactory,
    listeningHistory: any[],
    songDurations: Map<string, number>,
    songArtists: Map<string, string>,
    songCollaborators: Map<string, any[]>,
    uid: string
) {
    const artistDAO = factory.createArtistDAO();

    const { artistPlays, artistListeningTime } = countArtistPlays(
        listeningHistory,
        songDurations,
        songArtists,
        songCollaborators
    );

    const sortedArtists = Object.entries(artistPlays)
        .sort((a, b) => b[1] - a[1]);

    const topArtistsData = await getTopArtistsData(artistDAO, sortedArtists);

    const totalPlays = listeningHistory.length;
    const topArtistPlayCount = sortedArtists[0]?.[1] || 0;
    const topArtist = topArtistsData[0]?.artist;

    const topArtistPercentage = totalPlays > 0
        ? Math.round((topArtistPlayCount / totalPlays) * 100)
        : 0;

    const topArtistId = topArtistsData[0]?.id;
    const topArtistListeningTime = topArtistId ? (artistListeningTime[topArtistId] || 0) : 0;

    const topArtistBadge = topArtistId
        ? await calculateArtistBadge(factory, topArtistId, uid, topArtistListeningTime / 60)
        : null;

    return {
        mostListened: {
            artist: topArtist || 'N/A',
            percentage: topArtistPercentage,
        },
        topArtists: topArtistsData,
        artistBadge: topArtistBadge
    };
}

function countArtistPlays(
    listeningHistory: any[],
    songDurations: Map<string, number>,
    songArtists: Map<string, string>,
    songCollaborators: Map<string, any[]>
) {
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

    return { artistPlays, artistListeningTime };
}

async function getTopArtistsData(artistDAO: any, sortedArtists: [string, number][]) {
    const topArtistsData = [];
    const topArtistIds = sortedArtists.slice(0, 5).map(entry => entry[0]);
    const topArtistsPromises = topArtistIds.map(artistId => artistDAO.findById(artistId));
    const topArtistsResults = await Promise.all(topArtistsPromises);

    for (let i = 0; i < topArtistsResults.length; i++) {
        const artist = topArtistsResults[i];
        if (artist) {
            topArtistsData.push({
                id: artist._id,
                artist: artist.artist_name,
                plays: sortedArtists[i][1]
            });
        }
    }

    return topArtistsData;
}

async function calculateArtistBadge(
    factory: MongoDBDAOFactory,
    artistId: string,
    userId: string,
    userListeningTimeMinutes?: number
): Promise<ArtistBadge> {
    if (!artistId || !userId) {
        return {
            artist: 'N/A',
            userListeningTime: 0,
            totalListeningTime: 0,
            percentile: 0,
        };
    }

    try {
        const artistDAO = factory.createArtistDAO();
        const artist = await artistDAO.findById(artistId);
        if (!artist) {
            return {
                artist: 'Artista desconocido',
                userListeningTime: userListeningTimeMinutes || 0,
                totalListeningTime: 0,
                percentile: 0,
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
            percentile = Math.round((userRankInfo.rank / userRankInfo.totalFans) * 100);
            if (percentile < 0.1) {
                percentile = 0.1;
            }
        }

        const badge = percentile > 0
            ? `Estás en el top ${percentile}% de oyentes`
            : 'Sin datos suficientes';

        return {
            artist: artist.artist_name,
            userListeningTime: Math.round(userTime),
            totalListeningTime: Math.round(userRankInfo.artistTotalListeningTime),
            percentile: percentile,
        };
    } catch (error) {
        console.error('Error calculando la insignia del artista:', error);
        return {
            artist: 'Error',
            userListeningTime: 0,
            totalListeningTime: 0,
            percentile: 0,
        };
    }
}

function calculatePreferredFormat(orders: OrderDTO[]): FormatStats {
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
        quantity
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