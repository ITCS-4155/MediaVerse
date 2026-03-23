import { NextResponse } from "next/server";
import { Redis } from '@upstash/redis';
import { XMLParser } from "fast-xml-parser";
import { normalizeMediaResults } from "../../../lib/mapper";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");
        const type = searchParams.get("type");

        if (!query || !type) {
            return NextResponse.json({ error: "Both 'q' and 'type' are required" }, { status: 400 });
        }

        const cacheKey = `search:${type}:${query.toLowerCase()}`;

        // CACHE CHECK
        const cachedIds = await redis.get(cacheKey);

        if (cachedIds && Array.isArray(cachedIds) && cachedIds.length > 0) {
            console.log(`🟢 CACHE HIT (Query): ${cacheKey}`);

            const cachedObjects = await redis.mget(...cachedIds);

            const validObjects = cachedObjects.filter(Boolean);

            if (validObjects.length > 0) {
                return NextResponse.json({ results: validObjects });
            }
        }

        console.log(`🔴 CACHE MISS: Fetching external APIs for ${cacheKey}`);
        let rawResults = [];

        // ==========================================
        // MOVIES / SHOWS (TMDB)
        // ==========================================
        if (type === "movie" || type === "show") {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}`,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`,
                    },
                }
            );
            if (!response.ok) throw new Error("TMDB fetch failed");
            const data = await response.json();
            rawResults = data.results;
        }

        // ==========================================
        // BOOKS (Google Books)
        // ==========================================
        else if (type === "book") {
            const response = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${process.env.GOOGLE_BOOKS_API_TOKEN}`
            );
            if (!response.ok) throw new Error("Google Books fetch failed");
            const data = await response.json();
            rawResults = data.items || [];
        }

        // ==========================================
        // VIDEO GAMES (IGDB / Twitch)
        // ==========================================
        else if (type === "game") {
            const response = await fetch("https://api.igdb.com/v4/games", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Client-ID": process.env.IGDB_CLIENT_ID,
                    "Authorization": `Bearer ${process.env.IGDB_API_TOKEN}`,
                },
                body: `search "${query}"; fields name, cover.url, first_release_date, summary; limit 10;`,
            });
            if (!response.ok) throw new Error("IGDB fetch failed");
            rawResults = await response.json();
        }

        // ==========================================
        // MUSIC / PODCASTS
        // ==========================================
        else if (type === "music") {
            const response = await fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album,track,show&limit=10`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.SPOTIFY_API_TOKEN}`,
                    },
                }
            );
            if (!response.ok) throw new Error("Spotify fetch failed");
            const data = await response.json();
            rawResults = [...(data.albums?.items || []), ...(data.tracks?.items || [])];
        }

        // ==========================================
        // BOARD GAMES
        // ==========================================
        else if (type === "boardgame") {
            const response = await fetch(
                `https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(query)}&type=boardgame`
            );
            if (!response.ok) throw new Error("BGG fetch failed");

            const xmlData = await response.text();
            const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
            const parsedData = parser.parse(xmlData);

            rawResults = parsedData.items?.item ? (Array.isArray(parsedData.items.item) ? parsedData.items.item : [parsedData.items.item]) : [];
        }

        else {
            return NextResponse.json({ error: "Invalid media type" }, { status: 400 });
        }

        // --- DATA TRANSFORMATION ---

        const normalizedResults = normalizeMediaResults(rawResults, type);

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