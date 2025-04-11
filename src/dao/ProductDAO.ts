import { ArtistDTO } from "../dto/ArtistDTO";
import { ProductDTO } from "../dto/ProductDTO";
import { RatingDTO } from "../dto/RatingDTO";
import { Product } from "../models/Product";
import { Rating } from "../models/Rating";
import { Genre } from "../models/Genre";
import {Song} from "../models/Song";
import {Album} from "../models/Album";

export interface IProductDAO {
    findById(_id: string): Promise<ProductDTO | null>
    findByTitle(title: string): Promise<ProductDTO[] | null>
    findByArtist(artist: ArtistDTO): Promise<ProductDTO[] | null>
    findByReleaseDateRange(from: Date, to: Date): Promise<ProductDTO[]>
    findWithFilters(
        genres?: string | string[],
        dateFilter?: 'today' | 'week' | 'month' | '3months' | '6months' | 'year',
        sortBy?: 'relevance' | 'releaseDate',
        skip?: number,
        limit?: number
    ): Promise<{products: ProductDTO[], totalCount: number}>

    getAll(): Promise<ProductDTO[]>

    update(product: ProductDTO): Promise<ProductDTO | null>

    delete(product: ProductDTO): Promise<boolean>

    getRatings(product: ProductDTO): Promise<RatingDTO[] | null>
    addRating(product: ProductDTO, rating: RatingDTO): Promise<ProductDTO | null>
    removeRating(product: ProductDTO, rating: RatingDTO): Promise<ProductDTO | null>
}

export class ProductDAO implements IProductDAO {
    constructor() {}

    async findById(_id: string): Promise<ProductDTO | null> {
        const product = await Product.findById(_id)
        if (!product) return null

        return ProductDTO.fromDocument(product)
    }

    async findByTitle(title: string): Promise<ProductDTO[] | null> {
        const products = await Product.find({ title })
        return products.map(product => ProductDTO.fromDocument(product))
    }

    async findByArtist(artist: ArtistDTO): Promise<ProductDTO[] | null> {
        const products = await Product.find({ author: artist._id })
        return products.map(product => ProductDTO.fromDocument(product))
    }

    async findByReleaseDateRange(from: Date, to: Date): Promise<ProductDTO[]> {
        const products = await Product.find({
            release_date: {
                $gte: from,
                $lte: to
            }
        })
        return products.map(product => ProductDTO.fromDocument(product))
    }

    async findWithFilters(
        genres?: string | string[],
        dateFilter?: 'today' | 'week' | 'month' | '3months' | '6months' | 'year',
        sortBy?: 'relevance' | 'releaseDate',
        skip?: number,
        limit?: number
    ): Promise<{products: ProductDTO[], totalCount: number}> {
        const filterQuery: any = {};

        if (dateFilter) {
            const now = new Date();
            let fromDate = new Date();

            switch (dateFilter) {
                case 'today':
                    fromDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    fromDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    fromDate.setMonth(now.getMonth() - 1);
                    break;
                case '3months':
                    fromDate.setMonth(now.getMonth() - 3);
                    break;
                case '6months':
                    fromDate.setMonth(now.getMonth() - 6);
                    break;
                case 'year':
                    fromDate.setFullYear(now.getFullYear() - 1);
                    break;
            }

            filterQuery.release_date = { $gte: fromDate };
        }

        const sortOptions: any = {};
        if (sortBy === 'relevance') {
            sortOptions.plays = -1;
        } else {
            sortOptions.release_date = -1;
        }

        if (genres) {
            let genreArray: string[];

            if (Array.isArray(genres)) {
                genreArray = genres;
            } else {
                genreArray = [genres];
            }

            if (genreArray.length > 0) {
                const genreQueries = genreArray.map(name => ({
                    genre: { $regex: new RegExp(`^${name}$`, 'i') }
                }));

                const foundGenres = await Genre.find({ $or: genreQueries });

                if (foundGenres.length === 0) {
                    return {
                        products: [],
                        totalCount: 0
                    };
                }

                const genreIds = foundGenres.map(g => g._id);

                const songsWithGenres = await Song.find({ genres: { $in: genreIds } });

                if (songsWithGenres.length === 0) {
                    return {
                        products: [],
                        totalCount: 0
                    };
                }

                const songIds = songsWithGenres.map(song => song._id);

                const albumsWithGenreSongs = await Album.find({
                    track_list: { $in: songIds }
                });

                const albumIds = albumsWithGenreSongs.map(album => album._id);

                filterQuery._id = { $in: [...songIds, ...albumIds] };
            }
        }

        const totalCount = await Product.countDocuments(filterQuery);

        let query = Product.find(filterQuery).sort(sortOptions);

        if (typeof skip === 'number' && typeof limit === 'number') {
            query = query.skip(skip).limit(limit);
        }

        const products = await query.exec();
        const productDTOs = products.map(product => ProductDTO.fromDocument(product));

        return {
            products: productDTOs,
            totalCount
        };
    }

    async getAll(): Promise<ProductDTO[]> {
        const products = await Product.find()
        return products.map(product => ProductDTO.fromDocument(product))
    }

    async update(product: ProductDTO): Promise<ProductDTO | null> {
        const updatedProduct = await Product.findByIdAndUpdate(
            product._id,
            { ...product.toJson() },
            { new: true }
        )

        if (!updatedProduct) return null

        return ProductDTO.fromDocument(updatedProduct)
    }

    async delete(product: ProductDTO): Promise<boolean> {
        const result = await Product.findByIdAndDelete(product._id)
        return result !== null
    }

    async getRatings(product: ProductDTO): Promise<RatingDTO[] | null> {
        if (!product.ratings || product.ratings.length === 0) {
            return null
        }

        const ratings = await Rating.find({
            _id: {$in: product.ratings}
        }).populate('author')

        return ratings.map(rating => RatingDTO.fromDocument(rating))
    }

    async addRating(product: ProductDTO, rating: RatingDTO): Promise<ProductDTO | null> {
        await Rating.create({
            ...rating.toJson()
        })

        const result = await Product.findByIdAndUpdate(product._id, {
            $push: { ratings: rating._id }
        }, { new: true })

        if (!result) return null

        return ProductDTO.fromDocument(result)
    }

    async removeRating(product: ProductDTO, rating: RatingDTO): Promise<ProductDTO | null> {
        await Rating.findByIdAndDelete(rating._id)

        const result = await Product.findByIdAndUpdate(product._id, {
            $pop: { ratings: rating._id }
        }, { new: true })

        if (!result) return null

        return ProductDTO.fromDocument(result)
    }
}