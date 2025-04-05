import { ProductDTO } from './ProductDTO';
import { SongDTO } from './SongDTO';
import { GenreDTO } from './GenreDTO';

export interface AlbumDTO extends ProductDTO {
    track_list: SongDTO[];
    genres: GenreDTO[];
}