// lib/genreDictionary.js

export const genreDictionary = {
    movie: {
        "Action": "28", "Drama": "18", "Comedy": "35", "Sci-Fi": "878",
        "Horror": "27", "Documentary": "99", "Animation": "16", "Thriller": "53"
    },
    music: {
        "Pop": "pop", "Hip-Hop": "hip-hop", "Rock": "rock", "Electronic": "electronic",
        "Jazz": "jazz", "Classical": "classical", "R&B": "r&b", "Indie": "indie"
    },
    book: {
        "Fiction": "fiction", "Non-Fiction": "nonfiction", "Sci-Fi": "science fiction",
        "Fantasy": "fantasy", "Mystery": "mystery", "Biography": "biography",
        "History": "history", "Self-Help": "self-help"
    },
    game: {
        "RPG": "12", "Action": "31", "Strategy": "15", "Indie": "32",
        "FPS": "5", "Sports": "14", "Adventure": "31", "Simulation": "13"
    },
    podcast: {
        "True Crime": "true crime", "Comedy": "comedy", "News": "news",
        "Technology": "technology", "Science": "science", "History": "history",
        "Business": "business", "Culture": "culture"
    }
};

export function getApiGenreFormat(mediaType, genreString) {
    if (!mediaType || !genreString || genreString === "All") return null;

    const typeMap = genreDictionary[mediaType.toLowerCase()];
    if (!typeMap) return genreString;

    return typeMap[genreString] || genreString;
}