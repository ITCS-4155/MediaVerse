"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { mediaThemes, getTheme, ArrowRight } from "../components/media/Mediathemes";

// ⚠️ Next.js requires useSearchParams to be wrapped in a Suspense boundary
export default function SearchPageWrapper() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#060810]" />}>
            <SearchPage />
        </Suspense>
    );
}

function SearchPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 1. Read the current state directly from the URL (e.g., ?type=movie&q=batman)
    const urlType = searchParams.get("type") || "film";
    const urlQuery = searchParams.get("q") || "";
    const urlGenre = searchParams.get("genre") || "";

    // 2. Local state for the UI
    const current = getTheme(urlType);
    const [searchInput, setSearchInput] = useState(urlQuery);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 3. The Fetch Logic (Triggered whenever the URL changes)
    useEffect(() => {
        const fetchResults = async () => {
            // Don't search if both query and genre are empty
            if (!urlQuery && !urlGenre) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                // Calls the Unified API route we built earlier!
                const res = await fetch(`/api/search?type=${urlType}&q=${encodeURIComponent(urlQuery)}&genre=${encodeURIComponent(urlGenre)}`);
                const data = await res.json();

                if (data.results) {
                    setResults(data.results);
                } else {
                    setError(data.error || "Failed to fetch results");
                }
            } catch (err) {
                setError("Something went wrong connecting to the server.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [urlType, urlQuery, urlGenre]);

    // 4. Update URL functions (These don't fetch data, they just change the URL, which triggers the useEffect)
    const handleTypeChange = (newType) => {
        // When changing types, we clear the genre because a Movie genre might not exist for Books
        router.push(`${pathname}?type=${newType}&q=${encodeURIComponent(searchInput)}&genre=`);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // When submitting a text search, we clear the genre to prioritize the text
        router.push(`${pathname}?type=${urlType}&q=${encodeURIComponent(searchInput)}&genre=`);
    };

    const handleGenreClick = (clickedGenre) => {
        const newGenre = urlGenre === clickedGenre ? "" : clickedGenre;

        setSearchInput("");
        router.push(`${pathname}?type=${urlType}&q=&genre=${encodeURIComponent(newGenre)}`);
    };

    const handleAdd = (item) => {
        console.log("Adding to Tracker via Server Action:", item.title);
        // TODO: Await saveMediaToList(item, listId, userId)
    };

    return (
        <div
            className="min-h-screen font-serif overflow-x-hidden transition-colors duration-500"
            style={{ backgroundColor: current.bg.includes("gradient") ? "#060810" : current.bg, color: current.text }}
        >
            <div className="fixed inset-0 pointer-events-none z-0 transition-all duration-700"
                 style={{ background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${current.accentSoft} 0%, transparent 60%)` }} />
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
                 style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
                 style={{ backgroundColor: `#060810f0`, borderBottom: `1px solid ${current.border}`, backdropFilter: "blur(12px)" }}>
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Link href="/explore" className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full inline-block transition-colors duration-500" style={{ backgroundColor: current.accent }} />
                        <span className="text-xs tracking-[0.18em] uppercase font-semibold transition-colors duration-500" style={{ color: current.accent }}>
              mediaverse
            </span>
                    </Link>

                    {/* Category tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto">
                        {mediaThemes.map((t) => (
                            <button key={t.id} onClick={() => handleTypeChange(t.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200"
                                    style={{
                                        backgroundColor: urlType === t.id ? t.accentSoft : "transparent",
                                        border: `1px solid ${urlType === t.id ? t.border : "transparent"}`,
                                        color: urlType === t.id ? t.accent : "rgba(255,255,255,0.3)",
                                    }}>
                                <span>{t.icon}</span>
                                <span className="hidden sm:inline">{t.label}</span>
                            </button>
                        ))}
                    </div>

                    <Link href="/profile"
                          className="text-xs font-bold px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-1"
                          style={{ backgroundColor: current.accent, color: "#060810" }}>
                        Your account
                    </Link>
                </div>
            </div>

            {/* Main content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20">

                {/* search bar */}
                <form onSubmit={handleSearchSubmit} className="mb-8 max-w-3xl">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder={`Search for a ${current.label.toLowerCase()} by title, creator, or keyword...`}
                            className="w-full bg-black/40 backdrop-blur-md rounded-2xl px-6 py-5 text-lg outline-none transition-all duration-300 placeholder:opacity-40"
                            style={{
                                border: `1px solid ${current.border}`,
                                color: current.text,
                                boxShadow: searchInput ? `0 0 20px ${current.accentSoft}` : 'none'
                            }}
                        />
                        <button
                            type="submit"
                            className="absolute right-3 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:opacity-80"
                            style={{ backgroundColor: current.accent, color: "#060810" }}
                        >
                            Search
                        </button>
                    </div>
                </form>

                {/* genre pills */}
                <div className="mb-12">
                    <p className="text-xs font-bold tracking-widest uppercase mb-4 transition-colors duration-500" style={{ color: current.accent }}>
                        Or browse by genre
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleGenreClick("")}
                            className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300"
                            style={{
                                backgroundColor: !urlGenre ? current.accentSoft : "transparent",
                                border: `1px solid ${current.border}`,
                                color: !urlGenre ? current.accent : current.sub
                            }}>
                            All
                        </button>
                        {current.subcategories.map((sub) => (
                            <button
                                key={sub}
                                onClick={() => handleGenreClick(sub)}
                                className="px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 hover:opacity-80"
                                style={{
                                    backgroundColor: urlGenre === sub ? current.accentSoft : "transparent",
                                    border: `1px solid ${current.border}`,
                                    color: urlGenre === sub ? current.accent : current.sub,
                                }}>
                                {sub}
                            </button>
                        ))}
                    </div>
                </div>

                {/* results */}
                <div>
                    <h2 className="text-sm font-bold tracking-widest uppercase mb-6 transition-colors duration-500" style={{ color: current.accent }}>
                        {urlQuery ? `Results for "${urlQuery}"` : urlGenre ? `${urlGenre} ${current.label}` : `Discover ${current.label}`}
                    </h2>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <span className="text-sm tracking-widest uppercase animate-pulse" style={{ color: current.accent }}>Searching the database...</span>
                        </div>
                    ) : error ? (
                        <div className="p-4 rounded-xl border" style={{ borderColor: current.border, backgroundColor: current.accentSoft, color: current.text }}>
                            {error}
                        </div>
                    ) : results.length === 0 && (urlQuery || urlGenre) ? (
                        <div className="text-center py-20 border border-dashed rounded-2xl" style={{ borderColor: current.border, color: current.sub }}>
                            No results found. Try a different search term or genre.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {results.map((item) => (
                                <div key={item.externalId} className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: "#111", border: `1px solid ${current.border}` }}>
                                    {/* Poster Image */}
                                    <div className="aspect-[2/3] w-full bg-neutral-900 relative">
                                        {item.imageUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-xs opacity-30">No Image</div>
                                        )}

                                        {/* Add to List Button Overlay */}
                                        <button
                                            onClick={() => handleAdd(item)}
                                            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                                            style={{ backgroundColor: current.accent, color: "#000" }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Info Card */}
                                    <div className="p-3">
                                        <h3 className="font-bold text-sm truncate" style={{ color: current.text }}>{item.title}</h3>
                                        <p className="text-xs mt-1 truncate" style={{ color: current.sub }}>
                                            {item.releaseDate ? item.releaseDate.substring(0, 4) : "Unknown Year"}
                                            {item.creator && ` • ${item.creator}`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}