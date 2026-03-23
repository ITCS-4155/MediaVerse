export function normalizeMediaResults(rawResults, type) {
    if (type === "movie" || type === "show") {
        return rawResults
            .filter((item) => item.media_type === "movie" || item.media_type === "tv")
            .map(mapTMDB);
    }

    // SPACE FOR OTHER TYPES OF MEDIA
    return [];
}

// TMDB MAPPER
function mapTMDB(item) {
    return {
        title: item.title || item.name,
        type: item.media_type === "tv" ? "Show" : "Movie",
        description: item.overview || null,

        imageUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,

        releaseDate: item.release_date || item.first_air_date || null,
        externalId: `tmdb-${item.id}`,
        genres: [],
        creator: null,

        id: null,
        rating: null,
        status: null,
        userId: null,
    };
}