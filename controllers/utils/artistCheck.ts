import Artist from '../../models/Artist';

/* Comprueba si existe un email o nombre artístico, excluyendo el propio id del artista si se requiere */
export const checkArtistDuplicates = async (
    email: string,
    artist_name: string,
    excludeId?: string
) => {
    const query = excludeId
        ? {
            $and: [
                { $or: [{ email }, { artist_name }] },
                { _id: { $ne: excludeId } }
            ]
        }
        : { $or: [{ email }, { artist_name }] };

    const existingArtist = await Artist.findOne(query);
    if (!existingArtist) {
        return { exists: false };
    }

    // Determinar el mensaje de error
    let message;
    if (existingArtist.email === email && existingArtist.artist_name === artist_name) {
        message = 'El email y el nombre artístico ya están registrados';
    } else if (existingArtist.email === email) {
        message = 'El email ya está registrado';
    } else {
        message = 'El nombre artístico ya está registrado';
    }

    return { exists: true, message };
};
