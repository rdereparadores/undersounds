import { OrderDTO } from "../dto/OrderDTO"
import { UserDTO } from "../dto/UserDTO"

export interface IOrderDAO {
    create(dto: OrderDTO): Promise<OrderDTO>

    findById(_id: string): Promise<OrderDTO | null>
    getOrdersFromUser(user: UserDTO): Promise<OrderDTO[] | null>

    getAll(): Promise<OrderDTO[]>

    update(dto: OrderDTO): Promise<OrderDTO | null>

    delete(dto: OrderDTO): Promise<boolean>

    checkIfPaid(dto: OrderDTO): Promise<boolean>
}