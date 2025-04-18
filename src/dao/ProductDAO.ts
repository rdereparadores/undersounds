import { ArtistDTO } from "../dto/ArtistDTO"
import { ProductDTO } from "../dto/ProductDTO"
import { RatingDTO } from "../dto/RatingDTO"
import { Product } from "../models/Product"
import { Rating } from "../models/Rating"
import { GenreDTO } from "../dto/GenreDTO"
import { SongDTO } from "../dto/SongDTO"
import { AlbumDTO } from "../dto/AlbumDTO"
import { Song } from "../models/Song"
import { Album } from "../models/Album"

export interface IProductDAO {
    findById(_id: string): Promise<ProductDTO | null>
    findByTitle(title: string): Promise<ProductDTO[]>
    findByArtist(artist: Partial<ArtistDTO>): Promise<ProductDTO[]>
    findByReleaseDateRange(from: Date, to: Date): Promise<ProductDTO[]>
    findWithFilters(
        skip: number,
        limit: number,
        query?: string,
        genres?: Partial<GenreDTO>[],
        date?: 'today' | 'week' | 'month' | '3months' | '6months' | 'year',
        sortBy?: 'relevance' | 'releaseDate'
    ): Promise<{ products: (SongDTO | AlbumDTO)[], totalCount: number }>

    getAll(): Promise<ProductDTO[]>

    delete(product: Partial<ProductDTO>): Promise<boolean>

    getRatings(product: Partial<ProductDTO>): Promise<RatingDTO[]>
    addRating(product: Partial<ProductDTO>, rating: RatingDTO): Promise<boolean>
    removeRating(product: Partial<ProductDTO>, rating: Partial<RatingDTO>): Promise<boolean>
}

export class ProductDAO implements IProductDAO {
    constructor() { }

    async findById(_id: string): Promise<ProductDTO | null> {
        const product = await Product.findById(_id)
        if (product === null) return null

        return ProductDTO.fromDocument(product)
    }

    async findByTitle(title: string): Promise<ProductDTO[]> {
        const products = await Product.find({ title })

        if (products === null) return []

        return products.map(product => ProductDTO.fromDocument(product))
    }

    async findByArtist(artist: Partial<ArtistDTO>): Promise<ProductDTO[]> {
        const products = await Product.find({ author: artist._id })

        if (products === null) return []

        return products.map(product => ProductDTO.fromDocument(product))
    }

    async findByReleaseDateRange(from: Date, to: Date): Promise<ProductDTO[]> {
        const products = await Product.find({
            release_date: {
                $gte: from,
                $lte: to
            }
        })

        if (products === null) return []

        return products.map(product => ProductDTO.fromDocument(product))
    }

    async findWithFilters(
        page: number,
        limit: number,
        query?: string,
        genres?: Partial<GenreDTO>[],
        date?: 'today' | 'week' | 'month' | '3months' | '6months' | 'year',
        sortBy?: 'relevance' | 'releaseDate'
    ): Promise<{ products: (SongDTO | AlbumDTO)[], totalCount: number }> {
        const filterQuery: {
            genres?: { $in: string[] },
            releaseDate?: {
                $gte?: Date,
                $lte?: Date
            },
            title?: { $regex: string, $options: string }
        } = {}

        if (genres) {
            const genreIds = genres.map(genre => genre._id!).filter(id => !!id)
            if (genreIds.length > 0) {
                filterQuery.genres = { $in: genreIds }
            }
        }

        if (query) {
            filterQuery.title = { $regex: query, $options: 'i' }
        }

        if (date) {
            const now = new Date()
            const fromDate: Date = new Date()

            switch (date) {
                case 'today':
                    fromDate.setHours(0, 0, 0, 0)
                    break
                case 'week':
                    fromDate.setDate(now.getDate() - 7)
                    break
                case 'month':
                    fromDate.setMonth(now.getMonth() - 1)
                    break
                case '3months':
                    fromDate.setMonth(now.getMonth() - 3)
                    break
                case '6months':
                    fromDate.setMonth(now.getMonth() - 6)
                    break
                case 'year':
                    fromDate.setFullYear(now.getFullYear() - 1)
                    break
            }

            filterQuery.releaseDate = { $gte: fromDate }
        }

        const sortOptions: { [key: string]: 1 | -1 } = {}

        if (sortBy === 'releaseDate') {
            sortOptions.releaseDate = -1
        } else {
            sortOptions.plays = -1
        }

        const totalCount = await Product.countDocuments(filterQuery)

        let queryResult = Product.find(filterQuery).sort(sortOptions)
        if (page > 0 && limit > 0) {
            queryResult = queryResult.skip((page - 1) * limit).limit(limit)
        }
        const products = await queryResult.exec()

        const productDTOs = await Promise.all(products.map(async (product) => {
            if (product.productType === 'song') {
                return SongDTO.fromDocument((await Song.findById(product._id))!)
            } else if (product.productType === 'album') {
                return AlbumDTO.fromDocument((await Album.findById(product._id))!)
            }
        }))
        const productDTOsFiltered = productDTOs.filter(product => product !== undefined)

        return {
            products: productDTOsFiltered,
            totalCount
        }
    }

    async getAll(): Promise<ProductDTO[]> {
        const products = await Product.find()
        return products.map(product => ProductDTO.fromDocument(product))
    }

    async delete(product: Partial<ProductDTO>): Promise<boolean> {
        const result = await Product.findByIdAndDelete(product._id)
        return result !== null
    }

    async getRatings(product: Partial<ProductDTO>): Promise<RatingDTO[]> {
        const productDoc = await Product.findById(product._id)

        if (productDoc === null) return []
        if (!productDoc.ratings || productDoc.ratings.length === 0) return []

        const ratings = await Rating.find({
            _id: { $in: productDoc.ratings }
        })

        return ratings.map(rating => RatingDTO.fromDocument(rating))
    }

    async addRating(product: Partial<ProductDTO>, rating: RatingDTO): Promise<boolean> {
        await Rating.create({
            ...rating.toJson()
        })

        const result = await Product.findByIdAndUpdate(product._id, {
            $push: { ratings: rating._id }
        }, { new: true })

        return result !== null
    }

    async removeRating(product: Partial<ProductDTO>, rating: Partial<RatingDTO>): Promise<boolean> {
        const ratingResult = await Rating.findByIdAndDelete(rating._id)
        if (ratingResult === null) return false

        const productResult = await Product.findByIdAndUpdate(product._id, {
            $pop: { ratings: rating._id }
        }, { new: true })

        return productResult !== null
    }
}