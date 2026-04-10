"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// --- MOCK DATA ---
const MOCK_USER = {
    name: "Maya S.",
    handle: "@mayastreams",
    bio: "Obsessive tracker of films, books & podcasts. Always mid-something.",
    isPro: true,
    stats: { tracked: 2341, lists: 18, followers: 412, following: 189 },
};

const MOCK_SAVED = [
    { id: 1,  type: "film",    title: "Dune: Part Two",        emoji: "🎬", rating: 4.5, status: "watched"  },
    { id: 2,  type: "film",    title: "Past Lives",            emoji: "🎬", rating: 5.0, status: "watched"  },
    { id: 3,  type: "film",    title: "The Brutalist",         emoji: "🎬", rating: 4.0, status: "watched"  },
    { id: 4,  type: "film",    title: "Anora",                 emoji: "🎬", rating: null, status: "watching" },
    { id: 5,  type: "book",    title: "Babel",                 emoji: "📚", rating: 4.5, status: "read"     },
    { id: 6,  type: "book",    title: "Piranesi",              emoji: "📚", rating: 5.0, status: "read"     },
    { id: 7,  type: "book",    title: "Fourth Wing",           emoji: "📚", rating: null, status: "backlog" },
    { id: 8,  type: "podcast", title: "99% Invisible",         emoji: "🎙️", rating: null, status: "following"},
    { id: 9,  type: "podcast", title: "Conan Needs a Friend",  emoji: "🎙️", rating: null, status: "following"},
    { id: 10, type: "game",    title: "Hollow Knight",         emoji: "🎮", rating: 5.0, status: "played"   },
    { id: 11, type: "music",   title: "Bright Future – Adrianne Lenker", emoji: "🎵", rating: 4.5, status: "listened" },
];

const MOCK_LISTS = [
    { id: 1, emoji: "🎬", title: "Films that wrecked me",      count: 24, visibility: "public"  },
    { id: 2, emoji: "📚", title: "Books to read before 30",    count: 12, visibility: "private" },
    { id: 3, emoji: "🎵", title: "Study music essentials",     count: 8,  visibility: "public"  },
    { id: 4, emoji: "🎮", title: "Games I keep replaying",     count: 6,  visibility: "public"  },
];

const MOCK_ACTIVITY = [
    { id: 1, emoji: "🎬", text: "Logged",         item: "Dune: Part Two",        suffix: "and gave it ★ 4.5", time: "2 hours ago"  },
    { id: 2, emoji: "📚", text: "Added",          item: "Fourth Wing",           suffix: "to backlog",        time: "Yesterday"    },
    { id: 3, emoji: "✏️", text: "Created list",   item: "Films that wrecked me", suffix: "",                  time: "3 days ago"   },
    { id: 4, emoji: "🎙️", text: "Started following", item: "99% Invisible",     suffix: "",                  time: "Last week"    },
];

const MEDIA_TYPE_LABELS = {
    film: "Films", book: "Books", podcast: "Podcasts", game: "Games", music: "Music",
};

const LIST_EMOJI_OPTIONS = ["🎬", "📚", "🎵", "🎮", "🎙️", "⚽"];


// --- SUB-COMPONENTS ---
function MediaCard({ item }) {
    const [starred, setStarred] = useState(item.rating >= 5);

    const bgMap = {
        film: "bg-[#1a0a1e]", book: "bg-[#0a1628]", game: "bg-[#0a1a0a]",
        music: "bg-[#1a1400]", podcast: "bg-[#1a0a0a]", sport: "bg-[#0d1a1a]",
    };

    return (
        <div
            className="group relative rounded-xl border border-gray-800 hover:border-gray-700 overflow-hidden cursor-pointer transition-colors"
            onClick={() => setStarred((s) => !s)}
        >
            <div className={`h-24 flex items-center justify-center text-3xl ${bgMap[item.type] ?? "bg-gray-900"}`}>
                {item.emoji}
            </div>
            <div className="p-2 bg-[#0d1117]">
                <p className="text-xs text-gray-200 truncate">{item.title}</p>
                <p className="text-[10px] text-gray-600 mt-0.5">
                    {item.rating ? `★ ${item.rating.toFixed(1)}` : item.status}
                </p>
            </div>
            <div className="absolute inset-0 bg-[#06080f]/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className={`text-2xl ${starred ? "text-amber-400" : "text-gray-500"}`}>★</span>
            </div>
        </div>
    );
}

function SavedTab({ items }) {
    const types = [...new Set(items.map((i) => i.type))];

    return (
        <div className="space-y-8">
            {types.map((type) => (
                <div key={type}>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs tracking-widest uppercase text-gray-500">{MEDIA_TYPE_LABELS[type] ?? type}</p>
                        <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">See all</button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {items.filter((i) => i.type === type).map((item) => (
                            <MediaCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function ListCard({ list }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-800 bg-gray-900/30 hover:border-gray-700 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-xl flex-shrink-0">
                {list.emoji}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-100 truncate">{list.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{list.count} items · {list.visibility}</p>
            </div>
            <span className="text-gray-600 text-lg">›</span>
        </div>
    );
}

function CreateListModal({ onClose, onCreate }) {
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("🎬");
    const [visibility, setVisibility] = useState("public");

    const handleCreate = () => {
        if (!name.trim()) return;
        onCreate({ emoji, title: name.trim(), visibility });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
            <div className="bg-[#0d1117] border border-gray-700 rounded-2xl p-6 w-full max-w-sm">
                <h2 className="text-base font-bold text-gray-100 mb-5">Create new list</h2>

                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Icon</p>
                <div className="flex gap-2 mb-4">
                    {LIST_EMOJI_OPTIONS.map((e) => (
                        <button
                            key={e}
                            onClick={() => setEmoji(e)}
                            className={`text-xl p-1.5 rounded-lg border transition-colors ${
                                emoji === e ? "border-emerald-400" : "border-gray-700 hover:border-gray-500"
                            }`}
                        >
                            {e}
                        </button>
                    ))}
                </div>

                <input
                    type="text"
                    placeholder="List name..."
                    maxLength={50}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#06080f] border border-gray-700 focus:border-emerald-400 outline-none rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-600 mb-4 transition-colors"
                />

                <div className="flex gap-2 mb-6">
                    {["public", "private"].map((v) => (
                        <button
                            key={v}
                            onClick={() => setVisibility(v)}
                            className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-colors capitalize ${
                                visibility === v
                                    ? "border-emerald-400 text-emerald-300"
                                    : "border-gray-700 text-gray-500 hover:border-gray-500"
                            }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-400 border border-gray-700 rounded-xl hover:border-gray-500 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={!name.trim()}
                        className="px-4 py-2 text-sm font-bold bg-emerald-300 text-[#06080f] rounded-xl hover:bg-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}

function ListsTab({ lists, onAddList }) {
    const [showModal, setShowModal] = useState(false);

    const handleCreate = (newList) => {
        onAddList({ id: Date.now(), count: 0, ...newList });
    };

    return (
        <>
            <div className="space-y-3">
                {lists.map((list) => (
                    <ListCard key={list.id} list={list} />
                ))}
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full flex items-center gap-3 p-4 rounded-2xl border border-dashed border-gray-800 hover:border-emerald-400/50 text-gray-600 hover:text-emerald-400 transition-colors text-sm"
                >
                    <span className="text-xl leading-none">+</span> Create new list
                </button>
            </div>
            {showModal && (
                <CreateListModal onClose={() => setShowModal(false)} onCreate={handleCreate} />
            )}
        </>
    );
}

function ActivityTab({ activity }) {
    return (
        <div className="space-y-3">
            {activity.map(({ id, emoji, text, item, suffix, time }) => (
                <div key={id} className="flex gap-4 p-4 rounded-2xl border border-gray-800 bg-gray-900/30 items-start">
                    <span className="text-2xl mt-0.5">{emoji}</span>
                    <div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            {text}{" "}
                            <span className="text-emerald-300 font-semibold">{item}</span>
                            {suffix && ` ${suffix}`}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{time}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}


// --- MAIN PROFILE PAGE ---
// 🛠️ FIX: Removed the { params } requirement so it works on the base /profile route
export default function ProfilePage() {
    const user = MOCK_USER;
    const [savedItems] = useState(MOCK_SAVED);
    const [lists, setLists] = useState(MOCK_LISTS);
    const [activeTab, setActiveTab] = useState("saved");
    const [following, setFollowing] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    const tabs = [
        { id: "saved",    label: "Saved"    },
        { id: "lists",    label: "Lists"    },
        { id: "activity", label: "Activity" },
    ];

    return (
        <div className="min-h-screen bg-[#06080f] text-gray-50 overflow-x-hidden font-serif">

            {/* Background accents */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(110,231,183,0.07) 0%, transparent 60%)" }}
            />
            <div
                className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            {/* Navbar */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled ? "bg-[#06080f]/90 backdrop-blur-md border-b border-gray-800/50" : ""
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/explore" className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 inline-block" />
                        <span className="text-xs tracking-[0.18em] uppercase text-emerald-300 font-semibold">mediaverse</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
                        <Link href="/explore" className="hover:text-gray-100 transition-colors">Explore</Link>
                        {/* 🛠️ FIX: Removed the hardcoded mayastreams links */}
                        <Link href="/profile" className="text-emerald-300 hover:text-emerald-200 transition-colors">
                            Profile
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/profile"
                            className="w-8 h-8 rounded-full bg-emerald-900/60 border border-emerald-800 flex items-center justify-center text-xs font-bold text-emerald-300 hover:bg-emerald-900 transition-colors"
                        >
                            {user.name.slice(0, 2).toUpperCase()}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Cover + avatar */}
            <div className="relative pt-16">
                <div
                    className="h-40 w-full bg-[#0d1117] border-b border-gray-800/60"
                    style={{ background: "radial-gradient(ellipse 80% 120% at 50% 100%, rgba(110,231,183,0.08) 0%, transparent 70%)" }}
                />
                <div className="absolute bottom-0 translate-y-1/2 left-6 md:left-12 w-20 h-20 rounded-full bg-emerald-900/60 border-4 border-[#06080f] flex items-center justify-center text-2xl font-bold text-emerald-300">
                    {user.name.slice(0, 2).toUpperCase()}
                </div>
            </div>

            {/* Profile header */}
            <div className="max-w-5xl mx-auto px-6 md:px-12 pt-14 pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl font-bold text-gray-50">{user.name}</h1>
                        {user.isPro && (
                            <span className="text-xs bg-emerald-900/60 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full font-semibold tracking-wide">
                Pro
              </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{user.handle}</p>
                    <p className="text-sm text-gray-400 mt-2 max-w-md leading-relaxed">{user.bio}</p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                    <button className="px-4 py-2 text-sm border border-gray-700 text-gray-400 rounded-xl hover:border-gray-500 hover:text-gray-200 transition-colors">
                        Edit profile
                    </button>
                </div>
            </div>

            {/* Stats row */}
            <div className="max-w-5xl mx-auto px-6 md:px-12">
                <div className="flex gap-8 pb-6 border-b border-gray-800/60">
                    {Object.entries(user.stats).map(([label, value]) => (
                        <div key={label}>
                            <p className="text-lg font-bold text-gray-50">{value.toLocaleString()}</p>
                            <p className="text-xs text-gray-600 uppercase tracking-widest mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-5xl mx-auto px-6 md:px-12">
                <div className="flex gap-6 border-b border-gray-800/60">
                    {tabs.map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`py-4 text-sm transition-colors border-b-2 -mb-px ${
                                activeTab === id
                                    ? "text-emerald-300 border-emerald-300"
                                    : "text-gray-500 border-transparent hover:text-gray-300"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab content */}
            <main className="max-w-5xl mx-auto px-6 md:px-12 py-10">
                {activeTab === "saved"    && <SavedTab items={savedItems} />}
                {activeTab === "lists"    && <ListsTab lists={lists} onAddList={(l) => setLists((prev) => [...prev, l])} />}
                {activeTab === "activity" && <ActivityTab activity={MOCK_ACTIVITY} />}
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-gray-800/50 py-10 px-6 mt-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-300 inline-block" />
                        <span className="text-xs tracking-[0.18em] uppercase text-emerald-300">mediaverse</span>
                    </div>
                    <p className="text-xs text-gray-600">© 2026 Mediaverse. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}