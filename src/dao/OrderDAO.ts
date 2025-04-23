import { ArtistDTO } from "../dto/ArtistDTO"
import { OrderDTO } from "../dto/OrderDTO"
import { ProductDTO } from "../dto/ProductDTO"
import { UserDTO } from "../dto/UserDTO"
import { Order } from "../models/Order"
import {BaseUser} from "../models/BaseUser";

export interface IOrderDAO {
    create(orders: OrderDTO): Promise<OrderDTO>

    findById(_id: string): Promise<OrderDTO | null>
    findByStripeCheckoutId(id: string): Promise<OrderDTO | null>
    findOrdersFromUser(user: Partial<UserDTO>): Promise<OrderDTO[]>
    findItemsSoldByArtist(artist: Partial<ArtistDTO>): Promise<{ 
        quantity: number, 
        format: 'cd' | 'digital' | 'vinyl' | 'cassette', 
        product: ProductDTO,
        purchaseDate: Date,
        price: number 
    }[] | null>

    getAll(): Promise<OrderDTO[]>

    update(order: Partial<OrderDTO>): Promise<boolean>

    delete(order: Partial<OrderDTO>): Promise<boolean>

    checkIfPaid(order: Partial<OrderDTO>): Promise<boolean>
    markAsPaid(order: Partial<OrderDTO>): Promise<boolean>
    hasUserPurchasedProductFormat(userId: string, productId: string, format: string): Promise<boolean>;
    getUserPurchasedProductFormats(userId: string, productId: string): Promise<{format: string, purchaseDate: Date}[]>;
}

export class OrderDAO implements IOrderDAO {
    constructor() {}

    async create(order: OrderDTO): Promise<OrderDTO> {
        const newOrder = await Order.create(order)

        return OrderDTO.fromDocument(newOrder)
    }

    async findById(_id: string): Promise<OrderDTO | null> {
        const order = await Order.findById(_id)
        if (!order) return null

        return OrderDTO.fromDocument(order)
    }

    async findByStripeCheckoutId(id: string): Promise<OrderDTO | null> {
        const order = await Order.findOne({ stripeCheckoutId: id })
        if (!order) return null

        return OrderDTO.fromDocument(order)
    }

    async findOrdersFromUser(user: Partial<UserDTO>): Promise<OrderDTO[]> {
        const orders = await Order.find({ user: user._id })
        if (orders === null) return []

        return orders.map(order => OrderDTO.fromDocument(order))
    }

    async findItemsSoldByArtist(artist: Partial<ArtistDTO>): Promise<{ 
        quantity: number, 
        format: 'cd' | 'digital' | 'vinyl' | 'cassette', 
        product: ProductDTO,
        purchaseDate: Date,
        price: number 
    }[] | null> {
        const orders = await Order.find().populate('lines.product')
        if (!orders) return null
        const lines: { quantity: number, format: 'cd' | 'digital' | 'vinyl' | 'cassette', product: ProductDTO, price: number, purchaseDate: Date }[] = []
        orders.forEach(order => {
            order.lines.forEach(line => {
                const product = line.product as unknown as ProductDTO
                if (product.author == artist._id!) {
                    lines.push({
                        quantity: line.quantity,
                        format: line.format,
                        product,
                        purchaseDate: order.purchaseDate,
                        price: line.price
                    })
                }
            })
        })

        return lines
    }

    async getAll(): Promise<OrderDTO[]> {
        const orders = await Order.find()

        return orders.map(order => OrderDTO.fromDocument(order))
    }

    async update(order: Partial<OrderDTO>): Promise<boolean> {
        const updatedOrder = await Order.findByIdAndUpdate(
            order._id,
            { ...order.toJson!() },
            { new: true }
        )

        return updatedOrder !== null
    }

    async delete(order: Partial<OrderDTO>): Promise<boolean> {
        const result = await Order.findByIdAndDelete(order._id)
        return result !== null
    }

    async checkIfPaid(order: Partial<OrderDTO>): Promise<boolean> {
        const orderDoc = await Order.findById(order._id!)
        if (orderDoc === null) return false

        return orderDoc.paid
    }

    async markAsPaid(order: Partial<OrderDTO>): Promise<boolean> {
        const orderDoc = await Order.findById(order._id!)
        if (orderDoc === null) return false
        const newOrder = OrderDTO.fromDocument(orderDoc)
        newOrder.paid = true

        const result = await Order.findByIdAndUpdate(
            order._id!,
            { ...newOrder.toJson!() },
            { new: true }
        )

        return result !== null
    }

    async hasUserPurchasedProductFormat(userId: string, productId: string, format: string): Promise<boolean> {
        const userDoc = await BaseUser.findOne({ uid: userId });
        if (!userDoc) return false;

        const orders = await Order.find({
            user: userDoc._id,
            paid: true,
            "lines.product": productId,
            "lines.format": format
        });

        return orders.length > 0;
    }

    async getUserPurchasedProductFormats(userId: string, productId: string): Promise<{format: string, purchaseDate: Date}[]> {
        const userDoc = await BaseUser.findOne({ uid: userId });
        if (!userDoc) return [];

        const orders = await Order.find({
            user: userDoc._id,
            paid: true,
        }).sort({ purchaseDate: -1 });

        const formats: {format: string, purchaseDate: Date}[] = [];

        for (const order of orders) {
            for (const line of order.lines) {
                if (line.product.toString() === productId) {
                    formats.push({
                        format: line.format,
                        purchaseDate: order.purchaseDate
                    });
                }
            }
        }

        const uniqueFormats: {format: string, purchaseDate: Date}[] = [];
        const formatsSeen = new Set<string>();

        for (const format of formats) {
            if (!formatsSeen.has(format.format)) {
                formatsSeen.add(format.format);
                uniqueFormats.push(format);
            }
        }

        return uniqueFormats;
    }
}