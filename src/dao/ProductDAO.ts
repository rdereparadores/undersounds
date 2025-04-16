import { ArtistDTO } from "../dto/ArtistDTO"
import { ProductDTO } from "../dto/ProductDTO"
import { RatingDTO } from "../dto/RatingDTO"
import { Product } from "../models/Product"
import { Rating } from "../models/Rating"
import { GenreDTO } from "../dto/GenreDTO"

export interface IProductDAO {
    findById(_id: string): Promise<ProductDTO | null>
    findByTitle(title: string): Promise<ProductDTO[]>
    findByArtist(artist: Partial<ArtistDTO>): Promise<ProductDTO[]>
    findByReleaseDateRange(from: Date, to: Date): Promise<ProductDTO[]>
    findWithFilters(
        skip: number,
        limit: number,
        genres?: Partial<GenreDTO>[],
        date?: 'today' | 'week' | 'month' | '3months' | '6months' | 'year',
        sortBy?: 'relevance' | 'releaseDate'
    ): Promise<{products: ProductDTO[], totalCount: number}>

    searchInLibrary(
        productIds: string[],
        searchTerm: string
    ): Promise<{
        id: string;
        title: string;
        author: { user_name: string };
        img_url: string;
    }[]>;

    getAll(): Promise<ProductDTO[]>

    delete(product: Partial<ProductDTO>): Promise<boolean>

    getRatings(product: Partial<ProductDTO>): Promise<RatingDTO[]>
    addRating(product: Partial<ProductDTO>, rating: RatingDTO): Promise<boolean>
    removeRating(product: Partial<ProductDTO>, rating: Partial<RatingDTO>): Promise<boolean>
}

export class ProductDAO implements IProductDAO {
    constructor() {}

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
        genres?: Partial<GenreDTO>[],
        date?: 'today' | 'week' | 'month' | '3months' | '6months' | 'year',
        sortBy?: 'relevance' | 'releaseDate'
    ): Promise<{products: ProductDTO[], totalCount: number}> {
        const filterQuery: {
            genres?: string[],
            releaseDate?: {
                $gte?: Date,
                $lte?: Date
            }
        } = {}

        if (genres) {
            filterQuery.genres = genres.map(genre => genre._id!)
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

        let query = Product.find(filterQuery).sort(sortOptions)
        query = query.skip((page - 1) * limit).limit(limit)
        const products = await query.exec()

        const productDTOs = products.map(product => ProductDTO.fromDocument(product))

        return {
            products: productDTOs,
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
            _id: {$in: productDoc.ratings}
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