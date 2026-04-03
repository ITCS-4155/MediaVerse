export function normalizeMediaResults(rawResults, type) {
    if (!rawResults || !Array.isArray(rawResults)) return [];

    if (type === "movie" || type === "show") {
        return rawResults
            .filter((item) => {
                return !item.media_type || item.media_type === "movie" || item.media_type === "tv";
            })
            .map((item) => {
                if (!item.media_type) {
                    item.media_type = type === "movie" ? "movie" : "tv";
                }
                return mapTMDB(item);
            });
    }

    if (type === "book") return rawResults.map(mapGoogleBooks);
    if (type === "game") return rawResults.map(mapIGDB);
    if (type === "music" || type === "podcast") return rawResults.map(mapSpotify);

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

        id: null, rating: null, status: null, userId: null,
    };
}

// GOOGLE BOOKS MAPPER
function mapGoogleBooks(item) {
    const info = item.volumeInfo || {};
    return {
        title: info.title || "Unknown Title",
        type: "Book",
        description: info.description || null,
        imageUrl: info.imageLinks?.thumbnail?.replace("zoom=1", "zoom=2") || null,
        releaseDate: info.publishedDate || null,
        externalId: `book-${item.id}`,
        genres: info.categories || [],
        creator: info.authors ? info.authors.join(", ") : null,

        id: null, rating: null, status: null, userId: null,
    };
}

// IGDB MAPPER
function mapIGDB(item) {
    return {
        title: item.name || "Unknown Game",
        type: "Game",
        description: item.summary || null,
        imageUrl: item.cover?.url ? `https:${item.cover.url.replace("t_thumb", "t_cover_big")}` : null,
        releaseDate: item.first_release_date ? new Date(item.first_release_date * 1000).toISOString().split('T')[0] : null,
        externalId: `igdb-${item.id}`,
        genres: [],
        creator: null,

        id: null, rating: null, status: null, userId: null,
    };
}

// SPOTIFY MAPPER
function mapSpotify(item) {
    return {
        title: item.name || "Unknown Track",
        type: item.type === "show" ? "Podcast" : "Music",
        description: item.description || null,
        imageUrl: item.images && item.images.length > 0 ? item.images[0].url : null,
        releaseDate: item.release_date || null,
        externalId: `spotify-${item.id}`,
        genres: [],
        creator: item.artists ? item.artists.map(a => a.name).join(", ") : (item.publisher || null),

        id: null, rating: null, status: null, userId: null,
    };
}