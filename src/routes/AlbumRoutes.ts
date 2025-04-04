// import express from 'express';
// import { AlbumController } from '../controllers/AlbumController';
//
// const router = express.Router();
// const albumController = new AlbumController();
//
// // Album routes
// router.get('/search', albumController.searchAlbumsByTitle);
// router.get('/date-range', albumController.getAlbumsByDateRange);
// router.get('/genre/:genreId', albumController.getAlbumsByGenre);
// router.get('/', albumController.getAllAlbums);
// router.get('/:id', albumController.getAlbumById);
// router.post('/', albumController.createAlbum);
// router.put('/:id', albumController.updateAlbum);
// router.delete('/:id', albumController.deleteAlbum);
//
// // Album relationships routes
// router.post('/:id/songs', albumController.addSongToAlbum);
// router.delete('/:id/songs/:songId', albumController.removeSongFromAlbum);
// router.post('/:id/genres', albumController.addGenreToAlbum);
// router.delete('/:id/genres/:genreId', albumController.removeGenreFromAlbum);
//
// export default router;