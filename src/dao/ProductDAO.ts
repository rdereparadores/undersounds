import { ArtistDTO } from "../dto/ArtistDTO";
import { ProductDTO } from "../dto/ProductDTO";
import { RatingDTO } from "../dto/RatingDTO";
import { Product } from "../models/Product";
import { Rating } from "../models/Rating";

export interface IProductDAO {
    findById(_id: string): Promise<ProductDTO | null>
    findByTitle(title: string): Promise<ProductDTO[] | null>
    findByArtist(artist: ArtistDTO): Promise<ProductDTO[] | null>
    findByReleaseDateRange(from: Date, to: Date): Promise<ProductDTO[]>

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