import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import ProductGenre from '../models/ProductGenre';
import ProductArtist from '../models/ProductArtist';
import ProductSong from '../models/ProductSong';
import Genre from '../models/Genre';
import Rating from '../models/Rating';

// Interfaces para mejorar la seguridad de tipos
interface TracklistItem {
    id: mongoose.Types.ObjectId;
    title: string;
    duration: number;
    img_url?: string;
    track_number: number;
    artists: Array<{ id: mongoose.Types.ObjectId; name: string }>;
}

// Buscar productos con filtros
export const searchProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            query = '',
            type,
            genre,
            release_days,
            sort_by = 'relevance',
            page = 1,
            limit = 20
        } = req.query;

        // Calcular skip para paginación
        const skip = (Number(page) - 1) * Number(limit);

        // Construir condiciones base de búsqueda
        const matchConditions: any = {};

        // Filtrar por tipo
        if (type) {
            matchConditions.type = type;
        }

        // Construir condiciones $or para búsqueda de texto
        const orConditions: any[] = [];
        if (query) {
            orConditions.push({ title: { $regex: new RegExp(String(query), 'i') } });
        }

        // Añadir condiciones $or si hay alguna
        if (orConditions.length > 0) {
            matchConditions.$or = orConditions;
        }

        // Filtrar por fecha de lanzamiento
        if (release_days) {
            const daysAgo = new Date();
            daysAgo.setDate(daysAgo.getDate() - Number(release_days));
            matchConditions.release_date = { $gte: daysAgo };
        }

        // Construir pipeline de agregación
        const pipeline: any[] = [
            { $match: matchConditions }
        ];

        // Manejar filtro por género si se proporciona
        if (genre) {
            // Primero encontrar IDs de género que coincidan con la consulta
            const genres = await Genre.find({
                genre: { $regex: new RegExp(String(genre), 'i') }
            });

            if (genres.length > 0) {
                const genreIds = genres.map(g => g._id);

                // Encontrar IDs de producto que tengan estos géneros
                const productGenres = await ProductGenre.find({
                    genre_id: { $in: genreIds }
                });

                const productIds = productGenres.map(pg => pg.product_id);

                // Añadir filtro para estos IDs de producto
                if (productIds.length > 0) {
                    matchConditions._id = { $in: productIds };
                    // Actualizar la etapa match
                    pipeline[0].$match = matchConditions;
                }
            }
        }

        // Búsqueda de artistas
        pipeline.push(
            {
                $lookup: {
                    from: 'productartists',
                    localField: '_id',
                    foreignField: 'product_id',
                    as: 'artistRelations'
                }
            },
            {
                $lookup: {
                    from: 'userauths',
                    localField: 'artistRelations.artist_id',
                    foreignField: '_id',
                    as: 'artists'
                }
            }
        );

        // Búsqueda de géneros
        pipeline.push(
            {
                $lookup: {
                    from: 'productgenres',
                    localField: '_id',
                    foreignField: 'product_id',
                    as: 'genreRelations'
                }
            },
            {
                $lookup: {
                    from: 'genres',
                    localField: 'genreRelations.genre_id',
                    foreignField: '_id',
                    as: 'genres'
                }
            }
        );

        // Si se proporciona una consulta, también buscar en nombres de artista
        if (query) {
            // Actualizar la condición $or de la etapa match para incluir búsqueda de artista
            pipeline[0].$match.$or.push({
                'artists.artist_name': { $regex: new RegExp(String(query), 'i') }
            });
        }

        // Aplicar ordenación
        let sortStage = {};
        if (sort_by === 'relevance') {
            sortStage = { popularity: -1 };
        } else if (sort_by === 'newest') {
            sortStage = { release_date: -1 };
        } else if (sort_by === 'oldest') {
            sortStage = { release_date: 1 };
        }

        pipeline.push({ $sort: sortStage });

        // Aplicar paginación
        pipeline.push(
            { $skip: skip },
            { $limit: Number(limit) }
        );

        // Proyectar solo los campos necesarios
        pipeline.push({
            $project: {
                _id: 1,
                title: 1,
                type: 1,
                img_url: 1,
                release_date: 1,
                price_digital: 1,
                price_cd: 1,
                price_vinyl: 1,
                price_cassette: 1,
                artists: {
                    _id: 1,
                    artist_name: 1
                },
                genres: {
                    _id: 1,
                    genre: 1
                }
            }
        });

        // Ejecutar la consulta
        const products = await Product.aggregate(pipeline);

        // Obtener conteo total para paginación
        const countPipeline = [...pipeline];
        // Eliminar etapas de paginación y proyección
        countPipeline.splice(-3, 3);
        countPipeline.push({ $count: 'total' });

        const countResult = await Product.aggregate(countPipeline);
        const totalCount = countResult.length > 0 ? countResult[0].total : 0;

        res.status(200).json({
            success: true,
            totalCount,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(totalCount / Number(limit)),
            data: products
        });
    } catch (error: any) {
        console.error('Error searching products:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching products',
            error: error.message
        });
    }
};

// Obtener detalles del producto por ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const productId = req.params.id;

        // Obtener producto base
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found'
            });
            return;
        }

        // Obtener artistas
        const productArtists = await ProductArtist.find({ product_id: productId })
            .populate('artist_id', 'artist_name');

        const artists = productArtists.map(pa => ({
            id: (pa.artist_id as any)?._id,
            name: (pa.artist_id as any)?.artist_name
        }));

        // Obtener géneros
        const productGenres = await ProductGenre.find({ product_id: productId })
            .populate('genre_id', 'genre');

        const genres = productGenres.map(pg => ({
            id: (pg.genre_id as any)?._id,
            name: (pg.genre_id as any)?.genre
        }));

        // Obtener lista de pistas si es un álbum
        let tracklist: TracklistItem[] = [];
        if (product.type === 'album') {
            const tracks = await ProductSong.find({ album_id: productId })
                .populate({
                    path: 'song_id',
                    select: 'title duration img_url'
                })
                .sort({ track_number: 1 });

            const trackPromises = tracks.map(async (track) => {
                const songId = (track.song_id as any)?._id;

                if (!songId) return null;

                // Obtener artistas para la canción
                const songArtists = await ProductArtist.find({ product_id: songId })
                    .populate('artist_id', 'artist_name');

                const trackArtists = songArtists.map(sa => ({
                    id: (sa.artist_id as any)?._id,
                    name: (sa.artist_id as any)?.artist_name
                }));

                return {
                    id: songId,
                    title: (track.song_id as any)?.title || 'Unknown',
                    duration: (track.song_id as any)?.duration || 0,
                    img_url: (track.song_id as any)?.img_url,
                    track_number: track.track_number,
                    artists: trackArtists
                };
            });

            const results = await Promise.all(trackPromises);
            tracklist = results.filter(item => item !== null) as TracklistItem[];
        }

        // Obtener estadísticas de valoración
        const ratingStats = await Rating.aggregate([
            { $match: { product_id: new mongoose.Types.ObjectId(productId) } },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: '$rating' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const avgRating = ratingStats.length > 0 ? ratingStats[0].avgRating : 0;
        const ratingCount = ratingStats.length > 0 ? ratingStats[0].count : 0;

        // Obtener distribución de valoraciones
        const ratingDistribution = await Rating.aggregate([
            { $match: { product_id: new mongoose.Types.ObjectId(productId) } },
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: -1 } }
        ]);

        const distribution = {
            five: 0,
            four: 0,
            three: 0,
            two: 0,
            one: 0
        };

        ratingDistribution.forEach(item => {
            switch(item._id) {
                case 5: distribution.five = item.count; break;
                case 4: distribution.four = item.count; break;
                case 3: distribution.three = item.count; break;
                case 2: distribution.two = item.count; break;
                case 1: distribution.one = item.count; break;
            }
        });

        // Obtener valoraciones recientes
        const recentRatings = await Rating.find({ product_id: productId })
            .populate('user_id', 'username img_url')
            .sort({ createdAt: -1 })
            .limit(5);

        const formattedRatings = recentRatings.map(rating => ({
            id: rating._id,
            rating: rating.rating,
            title: rating.title,
            description: rating.description,
            created_at: rating.createdAt,
            user: {
                id: (rating.user_id as any)?._id,
                username: (rating.user_id as any)?.username,
                img_url: (rating.user_id as any)?.img_url
            }
        }));

        // Ensamblar la respuesta
        res.status(200).json({
            success: true,
            data: {
                id: product._id,
                title: product.title,
                type: product.type,
                img_url: product.img_url,
                description: product.description,
                release_date: product.release_date,
                price_digital: product.price_digital,
                price_cd: product.price_cd,
                price_vinyl: product.price_vinyl,
                price_cassette: product.price_cassette,
                artists,
                genres,
                tracklist: product.type === 'album' ? tracklist : undefined,
                ratings: {
                    average: avgRating,
                    count: ratingCount,
                    distribution,
                    recent: formattedRatings
                }
            }
        });
    } catch (error: any) {
        console.error('Error getting product details:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting product details',
            error: error.message
        });
    }
};

// Obtener lista de pistas del álbum
export const getAlbumTracklist = async (req: Request, res: Response): Promise<void> => {
    try {
        const albumId = req.params.id;

        // Verificar que el álbum existe
        const album = await Product.findOne({ _id: albumId, type: 'album' });
        if (!album) {
            res.status(404).json({
                success: false,
                message: 'Album not found'
            });
            return;
        }

        // Obtener pistas
        const tracks = await ProductSong.find({ album_id: albumId })
            .populate({
                path: 'song_id',
                select: 'title duration img_url'
            })
            .sort({ track_number: 1 });

        // Obtener artistas para cada pista
        const tracksWithArtists = await Promise.all(tracks.map(async (track) => {
            const songId = (track.song_id as any)?._id;

            if (!songId) return null;

            // Obtener artistas de la canción
            const artistRelations = await ProductArtist.find({ product_id: songId })
                .populate('artist_id', 'artist_name');

            const trackArtists = artistRelations.map(rel => ({
                id: (rel.artist_id as any)?._id,
                name: (rel.artist_id as any)?.artist_name
            }));

            return {
                id: songId,
                title: (track.song_id as any)?.title || 'Unknown',
                duration: (track.song_id as any)?.duration || 0,
                img_url: (track.song_id as any)?.img_url,
                track_number: track.track_number,
                artists: trackArtists
            };
        }));

        // Filtrar elementos nulos
        const validTracks = tracksWithArtists.filter(item => item !== null);

        res.status(200).json({
            success: true,
            count: validTracks.length,
            data: validTracks
        });
    } catch (error: any) {
        console.error('Error getting album tracklist:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting album tracklist',
            error: error.message
        });
    }
};

// Obtener productos relacionados
export const getRelatedProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const productId = req.params.id;
        const limit = Number(req.query.limit) || 5;

        // Verificar que el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found'
            });
            return;
        }

        // Obtener géneros del producto
        const productGenres = await ProductGenre.find({ product_id: productId });
        const genreIds = productGenres.map(pg => pg.genre_id);

        // Obtener artistas del producto
        const productArtists = await ProductArtist.find({ product_id: productId });
        const artistIds = productArtists.map(pa => pa.artist_id);

        // Encontrar productos con géneros similares
        const relatedByGenre = await ProductGenre.aggregate([
            {
                $match: {
                    genre_id: { $in: genreIds },
                    product_id: { $ne: new mongoose.Types.ObjectId(productId) }
                }
            },
            {
                $group: {
                    _id: '$product_id',
                    genreMatchCount: { $sum: 1 }
                }
            },
            { $sort: { genreMatchCount: -1 } },
            { $limit: limit }
        ]);

        // Encontrar productos con los mismos artistas
        const relatedByArtist = await ProductArtist.aggregate([
            {
                $match: {
                    artist_id: { $in: artistIds },
                    product_id: { $ne: new mongoose.Types.ObjectId(productId) }
                }
            },
            {
                $group: {
                    _id: '$product_id',
                    artistMatchCount: { $sum: 1 }
                }
            },
            { $sort: { artistMatchCount: -1 } },
            { $limit: limit }
        ]);

        // Combinar ambas listas y eliminar duplicados
        const allRelatedIds = [
            ...relatedByGenre.map(item => item._id),
            ...relatedByArtist.map(item => item._id)
        ];

        const uniqueIds = [...new Set(allRelatedIds.map(id => id.toString()))];
        const limitedIds = uniqueIds.slice(0, limit).map(id => new mongoose.Types.ObjectId(id));

        // Obtener los productos completos
        const relatedProducts = await Product.find({ _id: { $in: limitedIds } });

        // Obtener artistas y géneros para cada producto
        const productsWithDetails = await Promise.all(relatedProducts.map(async (prod) => {
            // Obtener artistas
            const artistRelations = await ProductArtist.find({ product_id: prod._id })
                .populate('artist_id', 'artist_name');

            const productArtistList = artistRelations.map(rel => ({
                id: (rel.artist_id as any)?._id,
                name: (rel.artist_id as any)?.artist_name
            }));

            // Obtener géneros
            const genreRelations = await ProductGenre.find({ product_id: prod._id })
                .populate('genre_id', 'genre');

            const productGenreList = genreRelations.map(rel => ({
                id: (rel.genre_id as any)?._id,
                name: (rel.genre_id as any)?.genre
            }));

            return {
                id: prod._id,
                title: prod.title,
                type: prod.type,
                img_url: prod.img_url,
                artists: productArtistList,
                genres: productGenreList
            };
        }));

        res.status(200).json({
            success: true,
            count: productsWithDetails.length,
            data: productsWithDetails
        });
    } catch (error: any) {
        console.error('Error getting related products:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting related products',
            error: error.message
        });
    }
};

// Crear un nuevo producto
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    // Iniciar una sesión para transacción
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            title,
            type,
            description,
            img_url,
            release_date,
            price_digital,
            price_cd,
            price_vinyl,
            price_cassette,
            artists,  // Array de IDs de artista
            genres    // Array de IDs de género
        } = req.body;

        // Validar campos requeridos
        if (!title || !type || !price_digital) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({
                success: false,
                message: 'Title, type, and price_digital are required fields'
            });
            return;
        }

        // Validar tipo
        if (!['song', 'album'].includes(type)) {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({
                success: false,
                message: 'Type must be either "song" or "album"'
            });
            return;
        }

        // Crear producto
        const product = new Product({
            title,
            type,
            description,
            img_url,
            release_date: release_date || new Date(),
            price_digital,
            price_cd,
            price_vinyl,
            price_cassette,
            popularity: 0
        });

        const savedProduct = await product.save({ session });

        // Asociar artistas si se proporcionan
        const artistPromises = [];
        if (artists && artists.length > 0) {
            for (const artistId of artists) {
                const artistRelation = new ProductArtist({
                    product_id: savedProduct._id,
                    artist_id: artistId
                });
                artistPromises.push(artistRelation.save({ session }));
            }
            await Promise.all(artistPromises);
        }

        // Asociar géneros si se proporcionan
        const genrePromises = [];
        if (genres && genres.length > 0) {
            for (const genreId of genres) {
                const genreRelation = new ProductGenre({
                    product_id: savedProduct._id,
                    genre_id: genreId
                });
                genrePromises.push(genreRelation.save({ session }));
            }
            await Promise.all(genrePromises);
        }

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: savedProduct
        });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();

        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

// Actualizar producto
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    // Iniciar una sesión para transacción
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const productId = req.params.id;
        const {
            title,
            description,
            img_url,
            release_date,
            price_digital,
            price_cd,
            price_vinyl,
            price_cassette,
            artists,  // Array de IDs de artista
            genres    // Array de IDs de género
        } = req.body;

        // Verificar que el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            await session.abortTransaction();
            session.endSession();
            res.status(404).json({
                success: false,
                message: 'Product not found'
            });
            return;
        }

        // Actualizar producto
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                title: title !== undefined ? title : product.title,
                description: description !== undefined ? description : product.description,
                img_url: img_url !== undefined ? img_url : product.img_url,
                release_date: release_date !== undefined ? release_date : product.release_date,
                price_digital: price_digital !== undefined ? price_digital : product.price_digital,
                price_cd: price_cd !== undefined ? price_cd : product.price_cd,
                price_vinyl: price_vinyl !== undefined ? price_vinyl : product.price_vinyl,
                price_cassette: price_cassette !== undefined ? price_cassette : product.price_cassette
            },
            { new: true, session }
        );

        // Actualizar artistas si se proporcionan
        if (artists && artists.length > 0) {
            // Eliminar relaciones de artista existentes
            await ProductArtist.deleteMany({ product_id: productId }, { session });

            // Crear nuevas relaciones de artista
            const artistPromises = artists.map((artistIdValue: string) => {
                const artistRelation = new ProductArtist({
                    product_id: productId,
                    artist_id: artistIdValue
                });
                return artistRelation.save({ session });
            });

            await Promise.all(artistPromises);
        }

// Actualizar géneros si se proporcionan
        if (genres && genres.length > 0) {
            // Eliminar relaciones de género existentes
            await ProductGenre.deleteMany({ product_id: productId }, { session });

            // Crear nuevas relaciones de género
            const genrePromises = genres.map((genreIdValue: string) => {
                const genreRelation = new ProductGenre({
                    product_id: productId,
                    genre_id: genreIdValue
                });
                return genreRelation.save({ session });
            });

            await Promise.all(genrePromises);
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();

        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

// Eliminar producto
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    // Iniciar una sesión para transacción
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const productId = req.params.id;

        // Verificar que el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            await session.abortTransaction();
            session.endSession();
            res.status(404).json({
                success: false,
                message: 'Product not found'
            });
            return;
        }

        // Si es un álbum, verificar si tiene canciones asociadas
        if (product.type === 'album') {
            const hasSongs = await ProductSong.findOne({ album_id: productId });
            if (hasSongs) {
                await session.abortTransaction();
                session.endSession();
                res.status(400).json({
                    success: false,
                    message: 'Cannot delete album with associated songs'
                });
                return;
            }
        }

        // Eliminar relaciones de artistas
        await ProductArtist.deleteMany({ product_id: productId }, { session });

        // Eliminar relaciones de género
        await ProductGenre.deleteMany({ product_id: productId }, { session });

        // Si es una canción, eliminarla de cualquier álbum
        if (product.type === 'song') {
            await ProductSong.deleteMany({ song_id: productId }, { session });
        }

        // Eliminar valoraciones
        await Rating.deleteMany({ product_id: productId }, { session });

        // Eliminar el producto
        await Product.findByIdAndDelete(productId, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();

        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};

// Añadir canción a álbum
export const addSongToAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
        const albumId = req.params.albumId;
        const { songId, trackNumber } = req.body;

        // Verificar que el álbum existe y es de tipo 'album'
        const album = await Product.findOne({ _id: albumId, type: 'album' });
        if (!album) {
            res.status(404).json({
                success: false,
                message: 'Album not found'
            });
            return;
        }

        // Verificar que la canción existe y es de tipo 'song'
        const song = await Product.findOne({ _id: songId, type: 'song' });
        if (!song) {
            res.status(404).json({
                success: false,
                message: 'Song not found'
            });
            return;
        }

        // Verificar si la canción ya está en el álbum
        const existingTrack = await ProductSong.findOne({
            album_id: albumId,
            song_id: songId
        });

        if (existingTrack) {
            res.status(400).json({
                success: false,
                message: 'Song is already in the album'
            });
            return;
        }

        // Encontrar el siguiente número de pista si no se proporciona
        let nextTrackNumber = trackNumber;
        if (!nextTrackNumber) {
            const lastTrack = await ProductSong.findOne({ album_id: albumId })
                .sort({ track_number: -1 });
            nextTrackNumber = lastTrack ? lastTrack.track_number + 1 : 1;
        }

        // Crear la relación
        const productSong = new ProductSong({
            album_id: albumId,
            song_id: songId,
            track_number: nextTrackNumber
        });

        await productSong.save();

        res.status(201).json({
            success: true,
            message: 'Song added to album successfully',
            data: {
                album_id: albumId,
                song_id: songId,
                track_number: nextTrackNumber
            }
        });
    } catch (error: any) {
        console.error('Error adding song to album:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding song to album',
            error: error.message
        });
    }
};

// Eliminar canción de álbum
export const removeSongFromAlbum = async (req: Request, res: Response): Promise<void> => {
    try {
        const albumId = req.params.albumId;
        const songId = req.params.songId;

        // Verificar si la relación existe
        const track = await ProductSong.findOne({
            album_id: albumId,
            song_id: songId
        });

        if (!track) {
            res.status(404).json({
                success: false,
                message: 'Song not found in album'
            });
            return;
        }

        // Eliminar la relación
        await ProductSong.findByIdAndDelete(track._id);

        res.status(200).json({
            success: true,
            message: 'Song removed from album successfully'
        });
    } catch (error: any) {
        console.error('Error removing song from album:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing song from album',
            error: error.message
        });
    }
};

// Actualizar número de pista en álbum
export const updateTrackNumber = async (req: Request, res: Response): Promise<void> => {
    try {
        const albumId = req.params.albumId;
        const songId = req.params.songId;
        const { trackNumber } = req.body;

        // Validar número de pista
        if (!trackNumber || trackNumber < 1) {
            res.status(400).json({
                success: false,
                message: 'Track number must be a positive integer'
            });
            return;
        }

        // Verificar si la relación existe
        const track = await ProductSong.findOne({
            album_id: albumId,
            song_id: songId
        });

        if (!track) {
            res.status(404).json({
                success: false,
                message: 'Song not found in album'
            });
            return;
        }

        // Actualizar número de pista
        const updatedTrack = await ProductSong.findByIdAndUpdate(
            track._id,
            { track_number: trackNumber },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Track number updated successfully',
            data: updatedTrack
        });
    } catch (error: any) {
        console.error('Error updating track number:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating track number',
            error: error.message
        });
    }
};