// import { IProduct } from '../models/interfaces/IProduct';
// import { IAlbum } from '../models/interfaces/IAlbum';
// import { ISong } from '../models/interfaces/ISong';
// import { IGenre } from '../models/interfaces/IGenre';
// import { IRating } from '../models/interfaces/IRating';
//
// import { ProductResponseDTO } from '../dto/ProductDTO';
// import { AlbumResponseDTO } from '../dto/AlbumDTO';
// import { SongResponseDTO, SimpleSongResponseDTO, ArtistBasicDTO } from '../dto/SongDTO';
// import { GenreResponseDTO } from '../dto/GenreDTO';
// import { RatingResponseDTO, SimpleRatingResponseDTO, UserBasicDTO } from '../dto/RatingDTO';
//
// export class MapperUtils {
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
//      * Convierte un modelo Artist a ArtistBasicDTO
//      * @param artist El objeto artista a convertir
//      */
//     static toArtistBasicDTO(artist: any): ArtistBasicDTO {
//         return {
//             id: artist._id.toString(),
//             artist_name: artist.artist_name,
//             artist_user_name: artist.artist_user_name,
//             img_url: artist.img_url
//         };
//     }
//
//     /*
//      * Convierte un modelo User a UserBasicDTO
//      * @param user El objeto usuario a convertir
//      */
//     static toUserBasicDTO(user: any): UserBasicDTO {
//         return {
//             id: user._id.toString(),
//             name: user.name,
//             sur_name: user.sur_name,
//             img_url: user.img_url
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
//             performer: {} as ArtistBasicDTO,
//             collaborators: [],
//             genres: []
//         };
//
//         // Agregar performer, collaborators y genres solo si están populados
//         if (song.performer && typeof song.performer !== 'string') {
//             songDTO.performer = this.toArtistBasicDTO(song.performer);
//         }
//
//         if (song.collaborators && typeof song.collaborators[0] !== 'string') {
//             songDTO.collaborators = song.collaborators.map((collaborator: any) =>
//                 this.toArtistBasicDTO(collaborator)
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
//             author: {} as UserBasicDTO,
//             product: {} as ProductResponseDTO
//         };
//
//         // Agregar author y product solo si están populados
//         if (rating.author && typeof rating.author !== 'string') {
//             ratingDTO.author = this.toUserBasicDTO(rating.author);
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
//             const author = rating.author as any;
//             simpleRatingDTO.author = {
//                 id: author._id.toString(),
//                 name: author.name,
//                 sur_name: author.sur_name
//             };
//         }
//
//         return simpleRatingDTO;
//     }
// }