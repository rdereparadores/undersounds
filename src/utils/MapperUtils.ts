/**
 * Utilidades para mapear entre modelos y DTOs
 */

/*import { IUser } from '../models/interfaces/IUser';
import { IArtist } from '../models/interfaces/IArtist';
import { IProduct } from '../models/interfaces/IProduct';
import { IAlbum } from '../models/interfaces/IAlbum';
import { ISong } from '../models/interfaces/ISong';
import { IGenre } from '../models/interfaces/IGenre';
import { IRating } from '../models/interfaces/IRating';
import { IOrder, IOrderLine } from '../models/interfaces/IOrder';*/

//import { UserResponseDTO, AddressDTO } from '../dto/UserDTO';
//import { ArtistResponseDTO } from '../dto/ArtistDTO';
import { ProductResponseDTO } from '../dto/ProductDTO';
import { AlbumResponseDTO } from '../dto/AlbumDTO';
import { SongResponseDTO, SimpleSongResponseDTO } from '../dto/SongDTO';
import { GenreResponseDTO } from '../dto/GenreDTO';
import { RatingResponseDTO, SimpleRatingResponseDTO } from '../dto/RatingDTO';
//import { OrderResponseDTO, OrderLineResponseDTO, OrderSummaryDTO } from '../dto/OrderDTO';


// export class MapperUtils {
//     /*
//      * Convierte un modelo User a UserResponseDTO
//      * @param user El objeto usuario a convertir
//      */
//     static toUserDTO(user: IUser): UserResponseDTO {
//         return {
//             id: user._id.toString(),
//             name: user.name,
//             sur_name: user.sur_name,
//             birth_name: user.birth_name,
//             email: user.email,
//             uid: user.uid,
//             img_url: user.img_url,
//             addresses: user.addresses.map((address: any) => ({
//                 alias: address.alias,
//                 name: address.name,
//                 sur_name: address.sur_name,
//                 phone: address.phone,
//                 address: address.address,
//                 address_2: address.address_2,
//                 province: address.province,
//                 city: address.city,
//                 zip_code: address.zip_code,
//                 country: address.country,
//                 observations: address.observations
//             } as AddressDTO)),
//             createdAt: user.createdAt,
//             updatedAt: user.updatedAt
//         };
//     }
//
//     /*
//      * Convierte un modelo Artist a ArtistResponseDTO
//      * @param artist El objeto artista a convertir
//      */
//     static toArtistDTO(artist: IArtist): ArtistResponseDTO {
//         return {
//             ...this.toUserDTO(artist),
//             artist_name: artist.artist_name,
//             artist_user_name: artist.artist_user_name,
//             bank_account: artist.bank_account
//         };
//     }
//
//     /*
//      * Convierte un modelo Product a ProductResponseDTO
//      * @param product El objeto producto a convertir
//      */
//     static toProductDTO(product: IProduct): ProductResponseDTO {
//         return {
//             id: product._id.toString(),
//             title: product.title,
//             release_date: product.release_date,
//             description: product.description,
//             img_url: product.img_url,
//             duration: product.duration,
//             pricing: {
//                 cd: product.pricing.cd,
//                 digital: product.pricing.digital,
//                 cassette: product.pricing.cassette,
//                 vinyl: product.pricing.vinyl
//             },
//             product_type: product.product_type,
//             createdAt: product.createdAt,
//             updatedAt: product.updatedAt
//         };
//     }
//
//     /*
//      * Convierte un modelo Album a AlbumResponseDTO
//      * @param album El objeto álbum a convertir
//      */
//     static toAlbumDTO(album: IAlbum): AlbumResponseDTO {
//         const albumDTO = this.toProductDTO(album) as AlbumResponseDTO;
//
//         // Agregar track_list y genres solo si están populados
//         if (album.track_list && typeof album.track_list[0] !== 'string') {
//             albumDTO.track_list = album.track_list.map((song: any) =>
//                 this.toSongDTO(song as unknown as ISong)
//             );
//         } else {
//             albumDTO.track_list = [];
//         }
//
//         if (album.genres && typeof album.genres[0] !== 'string') {
//             albumDTO.genres = album.genres.map((genre: any) =>
//                 this.toGenreDTO(genre as unknown as IGenre)
//             );
//         } else {
//             albumDTO.genres = [];
//         }
//
//         return albumDTO;
//     }
//
//     /*
//      * Convierte un modelo Song a SongResponseDTO
//      * @param song El objeto canción a convertir
//      */
//     static toSongDTO(song: ISong): SongResponseDTO {
//         const songDTO: SongResponseDTO = {
//             id: song._id.toString(),
//             song_dir: song.song_dir,
//             title: song.title,
//             duration: song.duration,
//             plays: song.plays,
//             createdAt: song.createdAt,
//             updatedAt: song.updatedAt,
//             performer: {} as ArtistResponseDTO,
//             collaborators: [],
//             genres: []
//         };
//
//         // Agregar performer, collaborators y genres solo si están populados
//         if (song.performer && typeof song.performer !== 'string') {
//             songDTO.performer = this.toArtistDTO(song.performer as unknown as IArtist);
//         }
//
//         if (song.collaborators && typeof song.collaborators[0] !== 'string') {
//             songDTO.collaborators = song.collaborators.map((collaborator: any) =>
//                 this.toArtistDTO(collaborator as unknown as IArtist)
//             );
//         }
//
//         if (song.genres && typeof song.genres[0] !== 'string') {
//             songDTO.genres = song.genres.map((genre: any) =>
//                 this.toGenreDTO(genre as unknown as IGenre)
//             );
//         }
//
//         return songDTO;
//     }
//
//     /*
//      * Convierte un modelo Song a SimpleSongResponseDTO
//      * @param song El objeto canción a convertir
//      */
//     static toSimpleSongDTO(song: ISong): SimpleSongResponseDTO {
//         return {
//             id: song._id.toString(),
//             title: song.title,
//             duration: song.duration,
//             plays: song.plays
//         };
//     }
//
//     /*
//      * Convierte un modelo Genre a GenreResponseDTO
//      * @param genre El objeto género a convertir
//      */
//     static toGenreDTO(genre: IGenre): GenreResponseDTO {
//         return {
//             id: genre._id.toString(),
//             genre: genre.genre,
//             createdAt: genre.createdAt,
//             updatedAt: genre.updatedAt
//         };
//     }
//
//     /*
//      * Convierte un modelo Rating a RatingResponseDTO
//      * @param rating El objeto valoración a convertir
//      */
//     static toRatingDTO(rating: IRating): RatingResponseDTO {
//         const ratingDTO: RatingResponseDTO = {
//             id: rating._id.toString(),
//             rating: rating.rating,
//             title: rating.title,
//             description: rating.description,
//             publish_date: rating.publish_date,
//             createdAt: rating.createdAt,
//             updatedAt: rating.updatedAt,
//             author: {} as UserResponseDTO,
//             product: {} as ProductResponseDTO
//         };
//
//         // Agregar author y product solo si están populados
//         if (rating.author && typeof rating.author !== 'string') {
//             ratingDTO.author = this.toUserDTO(rating.author as unknown as IUser);
//         }
//
//         if (rating.product && typeof rating.product !== 'string') {
//             ratingDTO.product = this.toProductDTO(rating.product as unknown as IProduct);
//         }
//
//         return ratingDTO;
//     }
//
//     /*
//      * Convierte un modelo Rating a SimpleRatingResponseDTO
//      * @param rating El objeto valoración a convertir
//      */
//     static toSimpleRatingDTO(rating: IRating): SimpleRatingResponseDTO {
//         const simpleRatingDTO: SimpleRatingResponseDTO = {
//             id: rating._id.toString(),
//             rating: rating.rating,
//             title: rating.title,
//             author: {
//                 id: '',
//                 name: '',
//                 sur_name: ''
//             }
//         };
//
//         // Agregar autor solo si está populado
//         if (rating.author && typeof rating.author !== 'string') {
//             const author = rating.author as unknown as IUser;
//             simpleRatingDTO.author = {
//                 id: author._id.toString(),
//                 name: author.name,
//                 sur_name: author.sur_name
//             };
//         }
//
//         return simpleRatingDTO;
//     }
//
//     /*
//      * Convierte un modelo OrderLine a OrderLineResponseDTO
//      * @param orderLine El objeto línea de orden a convertir
//      */
//     static toOrderLineDTO(orderLine: IOrderLine): OrderLineResponseDTO {
//         const orderLineDTO: OrderLineResponseDTO = {
//             id: orderLine._id.toString(),
//             quantity: orderLine.quantity,
//             product: {} as ProductResponseDTO
//         };
//
//         // Agregar product solo si está populado
//         if (orderLine.product && typeof orderLine.product !== 'string') {
//             orderLineDTO.product = this.toProductDTO(orderLine.product as unknown as IProduct);
//         }
//
//         return orderLineDTO;
//     }
//
//     /*
//      * Convierte un modelo Order a OrderResponseDTO
//      * @param order El objeto orden a convertir
//      */
//     static toOrderDTO(order: IOrder): OrderResponseDTO {
//         const orderDTO: OrderResponseDTO = {
//             id: order._id.toString(),
//             purchase_date: order.purchase_date,
//             status: order.status,
//             paid: order.paid,
//             tracking_number: order.tracking_number,
//             createdAt: order.createdAt,
//             updatedAt: order.updatedAt,
//             client: {} as UserResponseDTO,
//             lines: []
//         };
//
//         // Agregar client solo si está populado
//         if (order.client && typeof order.client !== 'string') {
//             orderDTO.client = this.toUserDTO(order.client as unknown as IUser);
//         }
//
//         // Agregar líneas de orden
//         if (order.lines) {
//             orderDTO.lines = order.lines.map((line: IOrderLine) => this.toOrderLineDTO(line));
//         }
//
//         return orderDTO;
//     }
//
//     /*
//      * Convierte un modelo Order a OrderSummaryDTO
//      * @param order El objeto orden a convertir
//      */
//     static toOrderSummaryDTO(order: IOrder): OrderSummaryDTO {
//         let total_items = 0;
//         let total_amount = 0;
//
//         // Calcular totales si los productos están populados
//         if (order.lines) {
//             order.lines.forEach((line: IOrderLine) => {
//                 total_items += line.quantity;
//
//                 if (line.product && typeof line.product !== 'string') {
//                     const product = line.product as unknown as IProduct;
//                     // Usar el precio digital por defecto para calcular el total
//                     total_amount += line.quantity * product.pricing.digital;
//                 }
//             });
//         }
//
//         return {
//             id: order._id.toString(),
//             purchase_date: order.purchase_date,
//             status: order.status,
//             paid: order.paid,
//             total_items,
//             total_amount
//         };
//     }
// }

// Descomentar cuando todos los DTO esten implementados