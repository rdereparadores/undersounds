import express from 'express'
import apiErrorCodes from '../../utils/apiErrorCodes.json'

export const trendingSongsController = async (req: express.Request, res: express.Response) => {
    try {
        const songDAO = req.db!.createSongDAO()
        const artistDAO = req.db!.createArtistDAO()

        const trendingSongs = await songDAO.findMostPlayed(10)

        const enrichedTrendingSongs = await Promise.all(
            trendingSongs.map(async (song) => {
                let artistName = 'Unknown Artist';
                try {
                    const artist = await artistDAO.findById(song.author);
                    artistName = artist?.artistName || artist?.artistUsername || 'Unknown Artist';
                } catch (error) {
                    console.error(`Error fetching artist for song ${song._id}:`, error);
                }

                return {
                    ...song.toJson(),
                    artistName: artistName
                };
            })
        );

        res.json({
            data: {
                songs: enrichedTrendingSongs
            }
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