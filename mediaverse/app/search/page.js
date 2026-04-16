"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { mediaThemes, getTheme } from "../components/media/Mediathemes";
import { saveMedia, getUserProfile } from "../actions/library";
import MediaDetailsModal from "../components/media/Mediadetails";

export default function SearchPageWrapper() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#060810]" />}>
            <SearchPage />
        </Suspense>
    );
}

function getInitials(name) {
    if (!name) return "US";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function SearchPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [currentUser, setCurrentUser] = useState(null);

    const urlType = searchParams.get("type") || "movie";
    const urlQuery = searchParams.get("q") || "";
    const urlGenre = searchParams.get("genre") || "";

    const current = getTheme(urlType);
    const [searchInput, setSearchInput] = useState(urlQuery);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Initial Fetch (Resets when search params change)
    useEffect(() => {
        const fetchResults = async () => {
            setIsLoading(true);
            setError(null);
            setPage(1); // Reset to page 1 on new search

            try {
                const res = await fetch(`/media/search?type=${urlType}&q=${encodeURIComponent(urlQuery)}&genre=${encodeURIComponent(urlGenre)}&page=1`);
                const data = await res.json();

                if (data.results) {
                    setResults(data.results);
                    // If we get less than 10 results back, assume there are no more pages
                    setHasMore(data.results.length >= 10);
                } else {
                    setError(data.error || "Failed to fetch results");
                    setHasMore(false);
                }
            } catch (err) {
                setError("Something went wrong connecting to the server.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [urlType, urlQuery, urlGenre]);

    // 🛠️ NEW: Load More Function
    const handleLoadMore = async () => {
        if (isLoadingMore || !hasMore) return;

        const nextPage = page + 1;
        setIsLoadingMore(true);

        try {
            const res = await fetch(`/media/search?type=${urlType}&q=${encodeURIComponent(urlQuery)}&genre=${encodeURIComponent(urlGenre)}&page=${nextPage}`);
            const data = await res.json();

            if (data.results && data.results.length > 0) {
                setResults((prev) => [...prev, ...data.results]); // Append new results
                setPage(nextPage);
                if (data.results.length < 10) setHasMore(false); // Hide button if less than 10 items returned
            } else {
                setHasMore(false); // No more results
            }
        } catch (err) {
            console.error("Failed to load more:", err);
        } finally {
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await fetch(`/api/me?t=${Date.now()}`);
                const data = res.ok ? await res.json() : null;

                if (data?.user?.id) {
                    const profileRes = await getUserProfile(data.user.id);
                    setCurrentUser(profileRes.success ? profileRes.data : data.user);
                } else {
                    setCurrentUser(null);
                }
            } catch (error) {
                console.error("Failed to load user:", error);
                setCurrentUser(null);
            }
        }
        loadUser();
    }, []);

    const handleTypeChange = (newType) => {
        router.push(`${pathname}?type=${newType}&q=${encodeURIComponent(searchInput)}&genre=`);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.push(`${pathname}?type=${urlType}&q=${encodeURIComponent(searchInput)}&genre=`);
    };

    const handleGenreClick = (clickedGenre) => {
        const newGenre = urlGenre === clickedGenre ? "" : clickedGenre;
        setSearchInput("");
        router.push(`${pathname}?type=${urlType}&q=&genre=${encodeURIComponent(newGenre)}`);
    };

    const handleAdd = async (item) => {
        if (!currentUser) return;
        await saveMedia(item, currentUser.id);
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
                          className="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-105 overflow-hidden"
                          style={{
                              backgroundColor: current.accentSoft,
                              borderColor: current.border,
                              color: current.accent
                          }}
                          title={currentUser?.name || "Your Profile"}
                    >
                        {currentUser?.image ? (
                            <img src={currentUser.image} alt="User" className="w-full h-full object-cover" />
                        ) : currentUser?.name ? getInitials(currentUser.name) : "US"}
                    </Link>
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20">

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
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {results.map((item) => (
                                    <div
                                        key={item.externalId}
                                        className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                                        style={{ backgroundColor: "#111", border: `1px solid ${current.border}` }}
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        <div className="aspect-[2/3] w-full bg-neutral-900 relative">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d1117] p-4 text-center">
                                                    <span className="text-3xl mb-2 opacity-50">{current.icon}</span>
                                                    <span className="text-xs font-semibold opacity-40 uppercase tracking-widest" style={{ color: current.accent }}>
                                                        {current.label}
                                                    </span>
                                                </div>
                                            )}

                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleAdd(item); }}
                                                className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                                                style={{ backgroundColor: current.accent, color: "#000" }}
                                            >
                                                +
                                            </button>
                                        </div>

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

                            {hasMore && results.length > 0 && (
                                <div className="mt-12 flex justify-center">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={isLoadingMore}
                                        className="px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                                        style={{
                                            backgroundColor: current.accentSoft,
                                            color: current.accent,
                                            border: `1px solid ${current.border}`
                                        }}
                                    >
                                        {isLoadingMore ? "Loading..." : "See More"}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {selectedItem && (
                <MediaDetailsModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onAdd={handleAdd}
                />
            )}
        </div>
    );
}