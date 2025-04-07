import { OrderDTO } from "../dto/OrderDTO"
import { UserDTO } from "../dto/UserDTO"
import {Order} from "../models/Order";

export interface IOrderDAO {
    create(dto: OrderDTO): Promise<OrderDTO>

    findById(_id: string): Promise<OrderDTO | null>
    getOrdersFromUser(user: UserDTO): Promise<OrderDTO[] | null>

    getAll(): Promise<OrderDTO[]>

    update(dto: OrderDTO): Promise<OrderDTO | null>

    delete(dto: OrderDTO): Promise<boolean>

    checkIfPaid(dto: OrderDTO): Promise<boolean>
}

export class OrderDAO implements IOrderDAO {
    constructor() {}

    async create(dto: OrderDTO): Promise<OrderDTO> {
        const newOrder = await Order.create({
            purchase_date: dto.purchase_date,
            status: dto.status,
            paid: dto.paid,
            tracking_number: dto.tracking_number,
            user: dto.user,
            lines: dto.lines.map(line => ({
                quantity: line.quantity,
                format: line.format,
                product: line.product,
                price: line.price
            }))
        });

        return OrderDTO.fromDocument(newOrder);
    }

    async findById(_id: string): Promise<OrderDTO | null> {
        const order = await Order.findById(_id)
            .populate({
                path: 'user',
                select: 'name sur_name email img_url'
            })
            .populate({
                path: 'lines.product',
                select: 'title img_url product_type pricing'
            });

        if (!order) return null;

        return OrderDTO.fromDocument(order);
    }

    async getOrdersFromUser(user: UserDTO): Promise<OrderDTO[] | null> {
        const orders = await Order.find({ user: user._id })
            .populate({
                path: 'lines.product',
                select: 'title img_url product_type pricing'
            })
            .sort({ purchase_date: -1 });

        if (!orders || orders.length === 0) return null;

        return orders.map(order => OrderDTO.fromDocument(order));
    }

    async getAll(): Promise<OrderDTO[]> {
        const orders = await Order.find()
            .populate({
                path: 'user',
                select: 'name sur_name email img_url'
            })
            .populate({
                path: 'lines.product',
                select: 'title img_url product_type pricing'
            });

        return orders.map(order => OrderDTO.fromDocument(order));
    }

    async update(dto: OrderDTO): Promise<OrderDTO | null> {
        const updatedOrder = await Order.findByIdAndUpdate(
            dto,
            {
                status: dto.status,
                paid: dto.paid,
                tracking_number: dto.tracking_number
            },
            { new: true }
        )
            .populate({
                path: 'user',
                select: 'name sur_name email img_url'
            })
            .populate({
                path: 'lines.product',
                select: 'title img_url product_type pricing'
            });

        if (!updatedOrder) return null;

        return OrderDTO.fromDocument(updatedOrder);
    }

    async delete(dto: OrderDTO): Promise<boolean> {
        const result = await Order.findByIdAndDelete(dto);
        return result !== null;
    }

    async checkIfPaid(dto: OrderDTO): Promise<boolean> {
        const order = await Order.findById(dto);
        if (!order) return false;

        return order.paid;
    }
}