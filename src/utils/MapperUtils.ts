// import { IProduct } from '../models/interfaces/IProduct';
// import { IAlbum } from '../models/interfaces/IAlbum';
// import { ISong } from '../models/interfaces/ISong';
// import { IGenre } from '../models/interfaces/IGenre';
// import { IRating } from '../models/interfaces/IRating';
// import { IUser } from '../models/interfaces/IUser';
// import { IArtist } from '../models/interfaces/IArtist';
//
// import { ProductDTO } from '../dto/ProductDTO';
// import { AlbumDTO } from '../dto/AlbumDTO';
// import { SongDTO } from '../dto/SongDTO';
// import { GenreDTO } from '../dto/GenreDTO';
// import { RatingDTO } from '../dto/RatingDTO';
// import { UserDTO, AddressDTO } from '../dto/UserDTO';
// import { ArtistDTO } from '../dto/ArtistDTO';
//
// export class MapperUtils {
//     /*
//      * Convierte un modelo User a UserDTO
//      * @param user El objeto usuario a convertir
//      */
//     static toUserDTO(user: IUser): UserDTO {
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
//      * Convierte un modelo Artist a ArtistDTO
//      * @param artist El objeto artista a convertir
//      */
//     static toArtistDTO(artist: IArtist): ArtistDTO {
//         return {
//             ...this.toUserDTO(artist),
//             artist_name: artist.artist_name,
//             artist_user_name: artist.artist_user_name,
//             bank_account: artist.bank_account
//         };
//     }
//
//     /*
//      * Convierte un modelo Product a ProductDTO
//      * @param product El objeto producto a convertir
//      */
//     static toProductDTO(product: IProduct): ProductDTO {
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
//      * Convierte un modelo Album a AlbumDTO
//      * @param album El objeto álbum a convertir
//      */
//     static toAlbumDTO(album: IAlbum): AlbumDTO {
//         const albumDTO = this.toProductDTO(album) as AlbumDTO;
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
//      * Convierte un modelo Song a SongDTO
//      * @param song El objeto canción a convertir
//      */
//     static toSongDTO(song: ISong): SongDTO {
//         const songDTO: SongDTO = {
//             id: song._id.toString(),
//             song_dir: song.song_dir,
//             title: song.title,
//             duration: song.duration,
//             plays: song.plays,
//             createdAt: song.createdAt,
//             updatedAt: song.updatedAt,
//             performer: {} as ArtistDTO,
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
//      * Convierte un modelo Genre a GenreDTO
//      * @param genre El objeto género a convertir
//      */
//     static toGenreDTO(genre: IGenre): GenreDTO {
//         return {
//             id: genre._id.toString(),
//             genre: genre.genre,
//             createdAt: genre.createdAt,
//             updatedAt: genre.updatedAt
//         };
//     }
//
//     /*
//      * Convierte un modelo Rating a RatingDTO
//      * @param rating El objeto valoración a convertir
//      */
//     static toRatingDTO(rating: IRating): RatingDTO {
//         const ratingDTO: RatingDTO = {
//             id: rating._id.toString(),
//             rating: rating.rating,
//             title: rating.title,
//             description: rating.description,
//             publish_date: rating.publish_date,
//             createdAt: rating.createdAt,
//             updatedAt: rating.updatedAt,
//             author: {} as UserDTO,
//             product: {} as ProductDTO
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
// }