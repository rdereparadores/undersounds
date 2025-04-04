/* import { IProductDAO } from "../interfaces/IProductDAO";
import { IProduct } from "../../models/interfaces/IProduct";
import ProductModel from "../../models/ProductModel";
import { ApiError } from "../../utils/ApiError";
import mongoose from "mongoose";

export class ProductDAO implements IProductDAO {
    async findAll(): Promise<IProduct[]> {
        return await ProductModel.find();
    }

    async findById(id: string): Promise<IProduct | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid product ID format');
        }
        return await ProductModel.findById(id);
    }

    async findByTitle(title: string): Promise<IProduct[]> {
        return await ProductModel.find({
            title: { $regex: title, $options: 'i' }
        });
    }

    async findByDateRange(startDate: Date, endDate: Date): Promise<IProduct[]> {
        return await ProductModel.find({
            release_date: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ release_date: -1 });
    }

    async create(productData: Partial<IProduct>): Promise<IProduct> {
        const newProduct = new ProductModel(productData);
        return await newProduct.save();
    }

    async update(id: string, productData: Partial<IProduct>): Promise<IProduct | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid product ID format');
        }

        return await ProductModel.findByIdAndUpdate(
            id,
            { $set: productData },
            { new: true, runValidators: true }
        );
    }

    async delete(id: string): Promise<boolean> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw ApiError.badRequest('Invalid product ID format');
        }

        const result = await ProductModel.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }
}

 */

// DESCOMENTAR CUANDO LA CARPETA MODELO ESTE IMPORTADA