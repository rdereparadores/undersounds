import { ArtistDTO } from "../dto/ArtistDTO"
import { ProductDTO } from "../dto/ProductDTO"
import { RatingDTO } from "../dto/RatingDTO"
import { Product } from "../models/Product"
import { Rating } from "../models/Rating"
import { GenreDTO } from "../dto/GenreDTO"
import { BaseUser } from "../models/BaseUser"

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
    ): Promise<{ products: (ProductDTO)[], totalCount: number }>
    findRecommendations(product: Partial<ProductDTO>, limit: number): Promise<ProductDTO[]>

    getAll(): Promise<ProductDTO[]>

    delete(product: Partial<ProductDTO>): Promise<boolean>

    getRatings(product: Partial<ProductDTO>): Promise<RatingDTO[]>
    addRating(product: Partial<ProductDTO>, rating: RatingDTO): Promise<boolean>
    removeRating(product: Partial<ProductDTO>, rating: Partial<RatingDTO>): Promise<boolean>
    updateRating(rating: Partial<RatingDTO>): Promise<boolean>
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
    ): Promise<{ products: (ProductDTO)[], totalCount: number }> {
        const filterQuery: {
            genres?: { $all: string[] },
            releaseDate?: {
                $gte?: Date,
                $lte?: Date
            },
            title?: { $regex: string, $options: string },
            version: undefined
        } = {
            version: undefined
        }

        if (genres) {
            const genreIds = genres.map(genre => genre._id!).filter(id => !!id)
            if (genreIds.length > 0) {
                filterQuery.genres = { $all: genreIds }
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
            return ProductDTO.fromDocument(product)
        }))
        const productDTOsFiltered = productDTOs.filter(product => product !== undefined)

        return {
            products: productDTOsFiltered,
            totalCount
        }
    }

    async findRecommendations(product: Partial<ProductDTO>, limit: number): Promise<ProductDTO[]> {
        const productDoc = await Product.findById(product._id)
        if (productDoc === null) return []

        const recommendations = await Product.aggregate([
            {
                $match: {
                    _id: { $ne: productDoc._id },
                    genres: { $in: productDoc.genres },
                    version: undefined
                }
            },
            { $sample: { size: limit } }
        ])

        return recommendations.map(product => ProductDTO.fromDocument(product))
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
        const productDoc = await Product.findById(product._id);

        if (productDoc === null || !productDoc.ratings || productDoc.ratings.length === 0) return [];

        try {
            const ratings = await Rating.find({
                _id: { $in: productDoc.ratings }
            });

            const ratingDTOs = [];
            for (const rating of ratings) {
                const ratingDTO = RatingDTO.fromDocument(rating);
                ratingDTOs.push(ratingDTO);
            }

            return ratingDTOs;
        } catch (error) {
            console.error("Error al obtener valoraciones:", error);
            return [];
        }
    }

    async addRating(product: Partial<ProductDTO>, rating: Partial<RatingDTO>): Promise<boolean> {
        try {
            const newRating = await Rating.create({
                ...rating
            })

            if (!newRating) return false

            const result = await Product.findByIdAndUpdate(product._id, {
                $push: { ratings: newRating._id }
            }, { new: true })

            return result !== null
        } catch (error) {
            console.error("Error al agregar valoración:", error)
            return false
        }
    }

    async removeRating(product: Partial<ProductDTO>, rating: Partial<RatingDTO>): Promise<boolean> {
        try {
            const ratingResult = await Rating.findByIdAndDelete(rating._id)
            if (ratingResult === null) return false

            const productResult = await Product.findByIdAndUpdate(product._id, {
                $pull: { ratings: rating._id }
            }, { new: true })

            return productResult !== null
        } catch (error) {
            console.error("Error al eliminar valoración:", error)
            return false
        }
    }

    async updateRating(rating: Partial<RatingDTO>): Promise<boolean> {
        const result = await Rating.findByIdAndUpdate(rating._id, {
            ...rating.toJson!()
        }, { new: true })
        return result !== null
    }
}