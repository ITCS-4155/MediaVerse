import { NextResponse } from "next/server";
import { Redis } from '@upstash/redis';
import { normalizeMediaResults } from "../../../lib/mapper";
import { getApiGenreFormat } from "../../../lib/genreDictionary";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// ==========================================
// TOKEN GENERATORS
// ==========================================
async function getSpotifyToken() {
    const authString = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });
    const data = await res.json();
    return data.access_token;
}

async function getIGDBToken() {
    const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_CLIENT_SECRET}&grant_type=client_credentials`, {
        method: 'POST'
    });
    const data = await res.json();
    return data.access_token;
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q") || "";
        const genre = searchParams.get("genre") || "";
        let type = searchParams.get("type");

        const pageParam = searchParams.get("page") || "1";
        const page = parseInt(pageParam, 10) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        if (type === "film") type = "movie";

        if (!type) {
            return NextResponse.json({ error: "Type is required" }, { status: 400 });
        }

        const cacheTerm = query ? `text:${query.toLowerCase()}` : genre ? `genre:${genre.toLowerCase()}` : `all`;

        const cacheKey = `search:${type}:${cacheTerm}:page:${page}`;

        // --- CACHE CHECK ---
        const cachedIds = await redis.get(cacheKey);

        if (cachedIds && Array.isArray(cachedIds) && cachedIds.length > 0) {
            console.log(`🟢 CACHE HIT: ${cacheKey}`);
            const cachedObjects = await redis.mget(...cachedIds);
            const validObjects = cachedObjects.filter(Boolean);
            if (validObjects.length > 0) return NextResponse.json({ results: validObjects });
        }

        console.log(`🔴 CACHE MISS: Fetching external APIs for ${cacheKey}`);
        let rawResults = [];

        // ==========================================
        // MOVIES / SHOWS (TMDB)
        // ==========================================
        if (type === "movie" || type === "show") {
            let url;
            if (query) {
                url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&page=${page}`;
            } else if (genre) {
                const apiGenre = getApiGenreFormat("movie", genre);
                url = `https://api.themoviedb.org/3/discover/${type === "show" ? "tv" : "movie"}?with_genres=${apiGenre}&page=${page}`;
            } else {
                url = `https://api.themoviedb.org/3/discover/${type === "show" ? "tv" : "movie"}?sort_by=popularity.desc&page=${page}`;
            }

            const response = await fetch(url, { headers: { accept: "application/json", Authorization: `Bearer ${process.env.TMDB_API_TOKEN}` }});
            if (!response.ok) throw new Error("TMDB fetch failed");
            const data = await response.json();
            rawResults = data.results || [];
        }

        // ==========================================
        // BOOKS (Google Books)
        // ==========================================
        else if (type === "book") {
            let url;
            if (query) {
                url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${limit}&startIndex=${offset}&key=${process.env.GOOGLE_BOOKS_API_TOKEN}`;
            } else if (genre) {
                const apiGenre = getApiGenreFormat("book", genre);
                url = `https://www.googleapis.com/books/v1/volumes?q=subject:"${encodeURIComponent(apiGenre)}"&maxResults=${limit}&startIndex=${offset}&key=${process.env.GOOGLE_BOOKS_API_TOKEN}`;
            } else {
                url = `https://www.googleapis.com/books/v1/volumes?q=subject:"fiction"&orderBy=relevance&maxResults=${limit}&startIndex=${offset}&key=${process.env.GOOGLE_BOOKS_API_TOKEN}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error("Google Books fetch failed");
            const data = await response.json();
            rawResults = data.items || [];
        }

        // ==========================================
        // VIDEO GAMES (IGDB)
        // ==========================================
        else if (type === "game") {
            const freshIgdbToken = await getIGDBToken();
            let bodyString;

            if (query) {
                bodyString = `search "${query}"; fields name, cover.url, first_release_date, summary; where themes != (42); limit ${limit}; offset ${offset};`;
            } else if (genre) {
                const apiGenre = getApiGenreFormat("game", genre);
                bodyString = `fields name, cover.url, first_release_date, summary; where genres = (${apiGenre}) & themes != (42); limit ${limit}; offset ${offset};`;
            } else {
                bodyString = `fields name, cover.url, first_release_date, summary; where themes != (42); sort follows desc; limit ${limit}; offset ${offset};`;
            }

            const response = await fetch("https://api.igdb.com/v4/games", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Client-ID": process.env.IGDB_CLIENT_ID,
                    "Authorization": `Bearer ${freshIgdbToken}`
                },
                body: bodyString,
            });

            if (!response.ok) throw new Error("IGDB fetch failed");
            rawResults = await response.json();
        }

        // ==========================================
        // MUSIC / PODCASTS (Spotify)
        // ==========================================
        else if (type === "music" || type === "podcast") {
            const freshSpotifyToken = await getSpotifyToken();

            let searchQuery = "";

            if (query) {
                searchQuery = query;
            } else if (genre) {
                if (type === "podcast") {
                    searchQuery = `${genre} podcast`;
                } else {
                    searchQuery = `genre:"${getApiGenreFormat("music", genre)}"`;
                }
            } else {
                if (type === "podcast") {
                    searchQuery = "trending podcasts";
                } else {
                    searchQuery = "tag:new";
                }
            }

            const url = `https://api.spotify.com/v1/search?q=$?q=${encodeURIComponent(searchQuery)}&type=${type === "podcast" ? "show" : "album,track"}&limit=${limit}&offset=${offset}`;

            const response = await fetch(url, { headers: { Authorization: `Bearer ${freshSpotifyToken}` } });

            if (!response.ok) throw new Error("Spotify fetch failed");
            const data = await response.json();

            const validAlbums = (data.albums?.items || []).filter(album => album.album_type !== "compilation");
            const validTracks = (data.tracks?.items || []).filter(track => track.album?.album_type !== "compilation");

            rawResults = [
                ...validAlbums,
                ...validTracks,
                ...(data.shows?.items || [])
            ];
        }

        else {
            return NextResponse.json({ error: "Invalid media type" }, { status: 400 });
        }

        // --- DATA TRANSFORMATION
        const normalizedResults = normalizeMediaResults(rawResults, type).slice(0, 10);

        // --- CACHE SAVE ---
        if (normalizedResults.length > 0) {
            const resultIds = [];
            const pipeline = redis.pipeline();

            for (const item of normalizedResults) {
                if (item.externalId) {
                    resultIds.push(item.externalId);
                    pipeline.set(item.externalId, item, { ex: 86400 });
                }
            }

            if (resultIds.length > 0) {
                pipeline.set(cacheKey, resultIds, { ex: 86400 });
                await pipeline.exec();
            }
        }

        return NextResponse.json({ results: normalizedResults });

    } catch (error) {
        console.error(`[${req.method}] /api/search ERROR:`, error);
        return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
    }
}