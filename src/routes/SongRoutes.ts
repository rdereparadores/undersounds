// import express from 'express';
// import { SongController } from '../controllers/SongController';
//
// const router = express.Router();
// const songController = new SongController();
//
// // Song routes
// router.get('/search', songController.searchSongsByTitle);
// router.get('/most-played', songController.getMostPlayedSongs);
// router.get('/performer/:performerId', songController.getSongsByPerformer);
// router.get('/genre/:genreId', songController.getSongsByGenre);
// router.get('/', songController.getAllSongs);
// router.get('/:id', songController.getSongById);
// router.post('/', songController.createSong);
// router.put('/:id', songController.updateSong);
// router.delete('/:id', songController.deleteSong);
// router.post('/:id/play', songController.incrementSongPlays);
//
// // Song relationships routes
// router.post('/:id/collaborators', songController.addCollaborator);
// router.delete('/:id/collaborators/:artistId', songController.removeCollaborator);
// router.post('/:id/genres', songController.addGenre);
// router.delete('/:id/genres/:genreId', songController.removeGenre);
//
// export default router;