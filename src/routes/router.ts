// import express from 'express';
// import albumRoutes from './AlbumRoutes';
// import songRoutes from './SongRoutes';
// import genreRoutes from './GenreRoutes';
// import productRoutes from './ProductRoutes';
// import ratingRoutes from './RatingRoutes';
// import shopRoutes from './ShopRoutes';
// // Descomenta cuando implementes las demás rutas
// // import userRoutes from './UserRoutes';
// // import artistRoutes from './ArtistRoutes';
// // import orderRoutes from './OrderRoutes';
//
// const router = express.Router();
//
// // Punto de verificación de la API
// router.get('/health', (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: 'UnderSounds API is running',
//         version: '1.0.0'
//     });
// });
//
// // Registrar todas las rutas
// router.use('/albums', albumRoutes);
// router.use('/songs', songRoutes);
// router.use('/genres', genreRoutes);
// router.use('/products', productRoutes);
// router.use('/ratings', ratingRoutes);
//
// // Descomenta cuando implementes las demás rutas
// // router.use('/users', userRoutes);
// // router.use('/artists', artistRoutes);
// // router.use('/orders', orderRoutes);
//
// export default router;