import express from 'express';
/*import userRoutes from './UserRoutes';
import artistRoutes from './ArtistRoutes';
import albumRoutes from './AlbumRoutes';
import songRoutes from './SongRoutes';
import genreRoutes from './GenreRoutes';
import orderRoutes from './OrderRoutes';
import ratingRoutes from './RatingRoutes';*/

const router = express.Router();

// Punto de verificación de la API
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'UnderSounds API is running',
        version: '1.0.0'
    });
});

// Registrar todas las rutas
/*router.use('/users', userRoutes);
router.use('/artists', artistRoutes);
router.use('/albums', albumRoutes);
router.use('/songs', songRoutes);
router.use('/genres', genreRoutes);
router.use('/orders', orderRoutes);
router.use('/ratings', ratingRoutes);*/

export default router;