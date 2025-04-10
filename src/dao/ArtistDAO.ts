import { ArtistDTO } from "../dto/ArtistDTO"
import {BaseUserDAO, IBaseUserDAO} from "./BaseUserDAO"
import { Artist } from "../models/Artist"
import {MongoDBDAOFactory} from "../factory/MongoDBDAOFactory";

export interface IArtistDAO extends IBaseUserDAO {
    create(dto: ArtistDTO): Promise<ArtistDTO>

    findById(_id: string): Promise<ArtistDTO | null>
    findByName(artistName: string): Promise<ArtistDTO[] | null>
    findByArtistUsername(artistUsername: string): Promise<ArtistDTO | null>
    findByEmail(email: string): Promise<ArtistDTO | null>
    findByUid(uid: string): Promise<ArtistDTO | null>

    getAll(): Promise<ArtistDTO[]>

    update(dto: ArtistDTO): Promise<ArtistDTO | null>

    delete(dto: ArtistDTO): Promise<boolean>

    getArtistMonthlySales(
        factory: MongoDBDAOFactory,
        artistId: string,
        startDate: Date,
        endDate: Date
    ): Promise<{
        totalQuantity: number,
        totalRevenue: number,
        formatDistribution: { format: string, quantity: number, revenue: number }[]
    }>

    getListenersCount(
        factory: MongoDBDAOFactory,
        artistId: string,
        startDate: Date,
        endDate: Date
    ): Promise<number>

    getTopSellingProducts(
        factory: MongoDBDAOFactory,
        artistId: string,
        limit: number,
        startDate: Date,
        endDate: Date
    ): Promise<{ product: string, title: string, quantity: number, revenue: number }[]>
}

export class ArtistDAO extends BaseUserDAO implements IArtistDAO {
    constructor() {super()}

    async create(dto: ArtistDTO): Promise<ArtistDTO> {
        const newArtist = await Artist.create(dto.toJson());
        return ArtistDTO.fromDocument(newArtist);
    }

    async findById(_id: string): Promise<ArtistDTO | null> {
        const artist = await Artist.findById(_id);
        if (!artist) return null;
        return ArtistDTO.fromDocument(artist);
    }

    async findByName(artistName: string): Promise<ArtistDTO[] | null > {
        const artists = await Artist.find({artist_name: artistName});
        return artists.map(ArtistDTO.fromDocument);
    }

    async findByArtistUsername(artistUsername: string): Promise<ArtistDTO | null> {
        const artist = await Artist.findOne({artist_user_name: artistUsername });
        if (!artist) return null;
        return ArtistDTO.fromDocument(artist);
    }

    async findByEmail(email: string): Promise<ArtistDTO | null> {
        const emailArtist = await Artist.findOne({email: email});
        if (!emailArtist) return null;
        return ArtistDTO.fromDocument(emailArtist);
    }

    async findByUid(uid: string): Promise<ArtistDTO | null> {
        const uidArtist = await Artist.findOne({uid: uid});
        if (!uidArtist) return null;
        return ArtistDTO.fromDocument(uidArtist);
    }

    async getAll(): Promise<ArtistDTO[]> {
        const artists = await Artist.find();
        return artists.map(artist => ArtistDTO.fromDocument(artist));
    }

    async update(dto: ArtistDTO): Promise<ArtistDTO | null> {
        const updatedArtist = await Artist.findByIdAndUpdate(dto._id,
            { ...dto.toJson() },
            { new: true }
        );
        if(!updatedArtist) return null;
        return ArtistDTO.fromDocument(updatedArtist);
    }

    async delete(dto: ArtistDTO): Promise<boolean> {
        const deletedArtist = await Artist.findByIdAndDelete(dto._id);
        return deletedArtist !== null
    }

    async getArtistMonthlySales(
        factory: MongoDBDAOFactory,
        artistId: string,
        startDate: Date,
        endDate: Date
    ): Promise<{
        totalQuantity: number,
        totalRevenue: number,
        formatDistribution: { format: string, quantity: number, revenue: number }[]
    }> {
        const orderDAO = factory.createOrderDAO();
        const productDAO = factory.createProductDAO();

        const allOrders = await orderDAO.getAll();

        const formatCounts: Record<string, {quantity: number, revenue: number}> = {
            digital: {quantity: 0, revenue: 0},
            cd: {quantity: 0, revenue: 0},
            vinyl: {quantity: 0, revenue: 0},
            cassette: {quantity: 0, revenue: 0}
        };

        let totalQuantity = 0;
        let totalRevenue = 0;

        const filteredOrders = allOrders.filter(order => {
            const orderDate = new Date(order.purchase_date);
            return orderDate >= startDate && orderDate <= endDate && order.paid;
        });

        for (const order of filteredOrders) {
            for (const line of order.lines) {

                const product = await productDAO.findById(line.product);
                if (product && product.author === artistId) {

                    totalQuantity += line.quantity;
                    totalRevenue += line.price * line.quantity;


                    if (formatCounts[line.format]) {
                        formatCounts[line.format].quantity += line.quantity;
                        formatCounts[line.format].revenue += line.price * line.quantity;
                    }
                }
            }
        }

        const formatDistribution = Object.entries(formatCounts).map(([format, data]) => ({
            format,
            quantity: data.quantity,
            revenue: data.revenue
        }));

        return {
            totalQuantity,
            totalRevenue,
            formatDistribution
        };
    }

    async getListenersCount(
        factory: MongoDBDAOFactory,
        artistId: string,
        startDate: Date,
        endDate: Date
    ): Promise<number> {
        try {
            const userDAO = factory.createUserDAO();
            const productDAO = factory.createProductDAO();

            const products = await productDAO.findByArtist({ uid: artistId } as any);
            const artistProductIds = products ? products.map(product => product._id) : [];

            if (artistProductIds.length === 0) {
                return 0;
            }

            const users = await userDAO.getAll();
            const uniqueListeners = new Set<string>();

            for (const user of users) {
                if (!user.listening_history || user.listening_history.length === 0) {
                    continue;
                }

                const hasListenedInRange = user.listening_history.some(entry => {
                    const songId = entry.song;

                    const isArtistSong = artistProductIds.some(id => {
                        if (!id) return false;
                        return id.toString() === songId || id === songId;
                    });

                    if (!isArtistSong) {
                        return false;
                    }

                    const playDate = new Date(entry.played_at);
                    return playDate >= startDate && playDate <= endDate;
                });

                if (hasListenedInRange && user.uid) {
                    uniqueListeners.add(user.uid);
                }
            }

            return uniqueListeners.size;
        } catch (error) {
            console.error('Error getting artist listeners count:', error);
            return 0;
        }
    }

    async getTopSellingProducts(
        factory: MongoDBDAOFactory,
        artistId: string,
        limit: number,
        startDate: Date,
        endDate: Date
    ): Promise<{ product: string, title: string, quantity: number, revenue: number }[]> {
        const orderDAO = factory.createOrderDAO();
        const productDAO = factory.createProductDAO();

        const allOrders = await orderDAO.getAll();

        const filteredOrders = allOrders.filter(order => {
            const orderDate = new Date(order.purchase_date);
            return orderDate >= startDate && orderDate <= endDate && order.paid;
        });

        const productSales: Record<string, { quantity: number, revenue: number }> = {};


        for (const order of filteredOrders) {
            for (const line of order.lines) {
                const product = await productDAO.findById(line.product);
                if (product && product.author === artistId) {
                    const productId = line.product;

                    if (!productSales[productId]) {
                        productSales[productId] = { quantity: 0, revenue: 0 };
                    }

                    productSales[productId].quantity += line.quantity;
                    productSales[productId].revenue += line.price * line.quantity;
                }
            }
        }

        const sortedProducts = Object.entries(productSales)
            .map(([productId, data]) => ({
                product: productId,
                quantity: data.quantity,
                revenue: data.revenue
            }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, limit);

        const result = [];
        for (const item of sortedProducts) {
            const product = await productDAO.findById(item.product);
            if (product) {
                result.push({
                    ...item,
                    title: product.title
                });
            }
        }

        return result;
    }
}