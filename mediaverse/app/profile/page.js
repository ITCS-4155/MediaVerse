"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    getUserLibrary, getUserLists, createCustomList, updateMediaEntry,
    deleteMediaItem, getListDetails, deleteList, removeMediaFromList, saveMediaToList,
    getUserProfile
} from "../actions/library";

const MEDIA_TYPE_LABELS = {
    movie: "Films", show: "TV Shows", book: "Books", podcast: "Podcasts", game: "Games", music: "Music",
};

const LIST_EMOJI_OPTIONS = ["🎬", "📚", "🎵", "🎮", "🎙️", "⚽", "⭐", "🔥", "📌", "📁"];

function getTypeEmoji(type) {
    const map = { movie: "🎬", show: "📺", book: "📚", podcast: "🎙️", game: "🎮", music: "🎵" };
    return map[type?.toLowerCase()] || "📌";
}

// --- MODALS & SUB-COMPONENTS ---
function MediaCard({ item, onClick }) {
    const bgMap = {
        movie: "bg-[#1a0a1e]", show: "bg-[#1a0a1e]", book: "bg-[#0a1628]", game: "bg-[#0a1a0a]",
        music: "bg-[#1a1400]", podcast: "bg-[#1a0a0a]"
    };

    return (
        <div
            className="group relative rounded-xl border border-gray-800 hover:border-gray-700 overflow-hidden cursor-pointer transition-colors flex flex-col"
            onClick={() => onClick(item)}
        >
            {item.imageUrl ? (
                <div className="h-32 w-full bg-cover bg-center" style={{ backgroundImage: `url(${item.imageUrl})` }} />
            ) : (
                <div className={`h-32 flex items-center justify-center text-4xl ${bgMap[item.type?.toLowerCase()] ?? "bg-gray-900"}`}>
                    {getTypeEmoji(item.type)}
                </div>
            )}
            <div className="p-2.5 bg-[#0d1117] flex-1 flex flex-col justify-between">
                <p className="text-xs text-gray-200 truncate font-semibold">{item.title}</p>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] text-gray-500 capitalize">{item.status}</p>
                    {item.rating && <p className="text-[10px] text-amber-400 font-bold">★ {item.rating}</p>}
                </div>
            </div>
            <div className="absolute inset-0 bg-[#06080f]/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest border border-emerald-400 px-3 py-1 rounded-full bg-[#06080f]">
                    Edit / Review
                </span>
            </div>
        </div>
    );
}

// Edit Media Modal
function EditMediaModal({ item, userLists, onClose, onUpdate, onDelete, onAddToList }) {
    const [status, setStatus] = useState(item.status || "Plan to Watch");
    const [rating, setRating] = useState(item.rating || "");
    const [review, setReview] = useState(item.review || "");
    const [selectedListId, setSelectedListId] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await onUpdate(item.id, {
            status,
            rating: rating ? parseFloat(rating) : null,
            review
        });
        setIsSaving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[#0d1117] border border-gray-700 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

                <div className="flex justify-between items-start mb-5 border-b border-gray-800 pb-4">
                    <h2 className="text-xl font-bold text-gray-100">{item.title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
                </div>

                {/* 🛠️ NEW: Added Media Details Section */}
                <div className="flex flex-col sm:flex-row gap-6 mb-8 bg-[#06080f] p-4 rounded-xl border border-gray-800">
                    {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.title} className="w-24 h-36 sm:w-32 sm:h-48 object-cover rounded-lg shadow-md flex-shrink-0" />
                    )}
                    <div className="flex-1 flex flex-col min-w-0">
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">{item.type}</p>
                        <p className="text-xs text-gray-500 mb-3">
                            {item.releaseDate ? new Date(item.releaseDate).getFullYear() : "Unknown Year"}
                            {item.creator && ` • ${item.creator}`}
                        </p>
                        <div className="flex-1 overflow-y-auto max-h-[120px] pr-2">
                            <p className="text-sm text-gray-400 italic leading-relaxed">
                                {item.description || "No description available."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-500 uppercase tracking-widest mb-1 block">Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-[#06080f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 outline-none focus:border-emerald-400">
                            <option>Plan to Watch</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                            <option>Dropped</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 uppercase tracking-widest mb-1 block">Rating (0-10)</label>
                        <input type="number" step="0.1" min="0" max="10" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="e.g. 8.5" className="w-full bg-[#06080f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 outline-none focus:border-emerald-400" />
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 uppercase tracking-widest mb-1 block">Review</label>
                        <textarea value={review} onChange={(e) => setReview(e.target.value)} rows={3} placeholder="What did you think?" className="w-full bg-[#06080f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 outline-none focus:border-emerald-400" />
                    </div>

                    {userLists.length > 0 && (
                        <div className="pt-4 border-t border-gray-800">
                            <label className="text-xs text-gray-500 uppercase tracking-widest mb-1 block">Add to List</label>
                            <div className="flex gap-2">
                                <select value={selectedListId} onChange={(e) => setSelectedListId(e.target.value)} className="flex-1 bg-[#06080f] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 outline-none focus:border-emerald-400">
                                    <option value="">Select a list...</option>
                                    {userLists.map(list => <option key={list.id} value={list.id}>{list.name}</option>)}
                                </select>
                                <button onClick={() => { if(selectedListId) onAddToList(item, selectedListId) }} disabled={!selectedListId} className="px-4 py-2 bg-emerald-900/60 text-emerald-300 border border-emerald-800 rounded-lg text-sm font-semibold hover:bg-emerald-900 disabled:opacity-50 transition-colors">Add</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 justify-between mt-8 pt-4 border-t border-gray-800">
                    <button onClick={() => onDelete(item.id)} className="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors">
                        Delete from Library
                    </button>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                        <button onClick={handleSave} disabled={isSaving} className="px-5 py-2 text-sm font-bold bg-emerald-300 text-[#06080f] rounded-lg hover:bg-emerald-200 transition-colors">
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Dedicated List View
function SpecificListView({ listId, userId, onBack, onListDeleted }) {
    const [listData, setListData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchList() {
            const res = await getListDetails(listId, userId);
            if (res.success) setListData(res.data);
            setIsLoading(false);
        }
        fetchList();
    }, [listId, userId]);

    const handleRemoveItem = async (mediaId) => {
        await removeMediaFromList(mediaId, listId, userId);
        setListData(prev => ({ ...prev, mediaItems: prev.mediaItems.filter(i => i.id !== mediaId) }));
    };

    const handleDeleteList = async () => {
        if (confirm("Are you sure you want to delete this list? The items will stay in your library.")) {
            await deleteList(listId, userId);
            onListDeleted(listId);
        }
    };

    if (isLoading) return <div className="text-center py-20 text-emerald-400 animate-pulse">Loading list...</div>;
    if (!listData) return <div className="text-center py-20 text-gray-500">List not found.</div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button onClick={onBack} className="text-sm text-emerald-400 hover:text-emerald-300 mb-6 flex items-center gap-2">
                ← Back to profile
            </button>
            <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-100">{listData.name}</h2>
                    <p className="text-sm text-gray-500 mt-2">{listData.mediaItems.length} items</p>
                </div>
                <button onClick={handleDeleteList} className="text-xs font-bold text-red-400 hover:text-red-300 px-4 py-2 rounded-lg border border-red-900 hover:bg-red-950 transition-colors">
                    Delete List
                </button>
            </div>

            {listData.mediaItems.length === 0 ? (
                <p className="text-center py-10 text-gray-500 border border-dashed border-gray-800 rounded-xl">This list is empty.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {listData.mediaItems.map(item => (
                        <div key={item.id} className="relative group">
                            <MediaCard item={item} onClick={() => {}} />
                            <button
                                onClick={(e) => { e.stopPropagation(); handleRemoveItem(item.id); }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg text-xs"
                                title="Remove from list"
                            >✕</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// --- MAIN TABS ---

function SavedTab({ items, onEditItem }) {
    if (items.length === 0) return <p className="text-gray-500 py-10 text-center">Your library is empty. Go explore!</p>;
    const types = [...new Set(items.map((i) => i.type))];

    return (
        <div className="space-y-10">
            {types.map((type) => (
                <div key={type}>
                    <div className="flex items-center justify-between mb-4 border-b border-gray-800/50 pb-2">
                        <p className="text-xs font-bold tracking-widest uppercase text-emerald-300">{MEDIA_TYPE_LABELS[type?.toLowerCase()] ?? type}</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {items.filter((i) => i.type === type).map((item) => (
                            <MediaCard key={item.id} item={item} onClick={onEditItem} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function ListsTab({ lists, onAddList, onViewList }) {
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("🎬");

    const handleCreate = () => {
        if (name.trim()) { onAddList(name, emoji); setName(""); setShowModal(false); }
    };

    return (
        <>
            <div className="space-y-3">
                {lists.map((list) => (
                    <div key={list.id} onClick={() => onViewList(list.id)} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-800 bg-gray-900/30 hover:border-gray-700 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-gray-700 transition-colors">
                            {list.emoji || "📁"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-100 truncate">{list.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{list._count?.mediaItems || 0} items</p>
                        </div>
                        <span className="text-gray-600 text-lg group-hover:text-emerald-400 transition-colors">›</span>
                    </div>
                ))}
                <button onClick={() => setShowModal(true)} className="w-full flex items-center gap-3 p-4 rounded-2xl border border-dashed border-gray-800 hover:border-emerald-400/50 text-gray-600 hover:text-emerald-400 transition-colors text-sm">
                    <span className="text-xl leading-none">+</span> Create new list
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4 backdrop-blur-sm">
                    <div className="bg-[#0d1117] border border-gray-700 rounded-2xl p-6 w-full max-w-sm">
                        <h2 className="text-base font-bold text-gray-100 mb-5">Create new list</h2>

                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Icon</p>
                        <div className="flex gap-2 mb-4">
                            {LIST_EMOJI_OPTIONS.map((e) => (
                                <button key={e} onClick={() => setEmoji(e)} className={`text-xl p-1.5 rounded-lg border transition-colors ${emoji === e ? "border-emerald-400" : "border-gray-700 hover:border-gray-500"}`}>{e}</button>
                            ))}
                        </div>

                        <input type="text" placeholder="List name..." value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#06080f] border border-gray-700 focus:border-emerald-400 outline-none rounded-xl px-4 py-3 text-sm text-gray-100 mb-6" />

                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-400 border border-gray-700 rounded-xl hover:border-gray-500">Cancel</button>
                            <button onClick={handleCreate} disabled={!name.trim()} className="px-4 py-2 text-sm font-bold bg-emerald-300 text-[#06080f] rounded-xl hover:bg-emerald-200 disabled:opacity-40">Create</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function ActivityTab({ savedItems }) {
    const recent = [...savedItems].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 15);
    if (recent.length === 0) return <p className="text-gray-500 py-10 text-center">No recent activity.</p>;

    return (
        <div className="space-y-3">
            {recent.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-2xl border border-gray-800 bg-gray-900/30 items-start">
                    <span className="text-2xl mt-0.5">{getTypeEmoji(item.type)}</span>
                    <div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            Updated <span className="text-emerald-300 font-semibold">{item.title}</span>
                            {item.status && <span className="text-gray-400"> to {item.status}</span>}
                            {item.rating && <span className="text-amber-400 font-bold"> • ★ {item.rating}</span>}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{new Date(item.updatedAt).toLocaleDateString()}</p>
                        {item.review && <p className="text-xs text-gray-400 mt-2 italic border-l-2 border-gray-700 pl-3">{item.review}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
}

// --- MAIN PROFILE PAGE ---

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [savedItems, setSavedItems] = useState([]);
    const [lists, setLists] = useState([]);

    const [activeTab, setActiveTab] = useState("saved");
    const [viewingListId, setViewingListId] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    useEffect(() => {
        async function loadData() {
            const userRes = await fetch(`/api/me?t=${Date.now()}`);
            const userData = userRes.ok ? await userRes.json() : null;

            if (userData?.user?.id) {
                const userId = userData.user.id;

                const [libRes, listsRes, profileRes] = await Promise.all([
                    getUserLibrary(userId),
                    getUserLists(userId),
                    getUserProfile(userId)
                ]);

                if (profileRes?.success) {
                    setUser(profileRes.data);
                } else {
                    setUser(userData.user);
                }

                if (libRes?.success) setSavedItems(libRes.data);
                if (listsRes?.success) setLists(listsRes.data);
            }
            setIsLoading(false);
        }
        loadData();
    }, []);

    // CRUD HANDLERS
    const handleUpdateItem = async (mediaId, updateData) => {
        const res = await updateMediaEntry(mediaId, user.id, updateData);
        if (res.success) {
            setSavedItems(prev => prev.map(item => item.id === mediaId ? res.data : item));
        }
    };

    const handleDeleteItem = async (mediaId) => {
        if(confirm("Delete this from your library entirely?")) {
            await deleteMediaItem(mediaId, user.id);
            setSavedItems(prev => prev.filter(item => item.id !== mediaId));
            setEditingItem(null);
        }
    };

    const handleCreateList = async (name, emoji) => {
        const res = await createCustomList(name, user.id);
        if (res.success) setLists(prev => [...prev, { ...res.list, emoji, _count: { mediaItems: 0 } }]);
    };

    const handleListDeleted = (listId) => {
        setLists(prev => prev.filter(l => l.id !== listId));
        setViewingListId(null);
    };

    const handleAddToList = async (item, listId) => {
        const res = await saveMediaToList(item, listId, user.id);
        if (res.success) {
            setLists(prev => prev.map(l => l.id === listId ? {...l, _count: { mediaItems: l._count.mediaItems + 1}} : l));
            setEditingItem(null);
        }
    };

    if (isLoading) return <div className="min-h-screen bg-[#06080f] flex items-center justify-center text-emerald-400">Loading profile...</div>;
    if (!user) return <div className="min-h-screen bg-[#06080f] flex items-center justify-center text-gray-500">Please log in to view your profile.</div>;

    const tabs = [
        { id: "saved",    label: "Saved" },
        { id: "lists",    label: "Lists" },
        { id: "activity", label: "Activity" },
    ];

    return (
        <div className="min-h-screen bg-[#06080f] text-gray-50 overflow-x-hidden font-serif">
            <div className="fixed inset-0 pointer-events-none z-0" style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(110,231,183,0.07) 0%, transparent 60%)" }} />
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#06080f]/90 backdrop-blur-md border-b border-gray-800/50" : ""}`}>
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/explore" className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 inline-block" />
                        <span className="text-xs tracking-[0.18em] uppercase text-emerald-300 font-semibold">mediaverse</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
                        <Link href="/explore" className="hover:text-gray-100 transition-colors">Explore</Link>
                        <Link href="/profile" className="text-emerald-300 hover:text-emerald-200 transition-colors">Profile</Link>
                    </div>
                </div>
            </nav>

            <div className="relative pt-16">
                <div className="h-40 w-full bg-[#0d1117] border-b border-gray-800/60" style={{ background: "radial-gradient(ellipse 80% 120% at 50% 100%, rgba(110,231,183,0.08) 0%, transparent 70%)" }} />

                <div className="absolute bottom-0 translate-y-1/2 left-6 md:left-12 w-20 h-20 rounded-full bg-emerald-900/60 border-4 border-[#06080f] flex items-center justify-center text-2xl font-bold text-emerald-300 overflow-hidden">
                    {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
                    ) : (
                        user.name?.slice(0, 2).toUpperCase() || "US"
                    )}
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 md:px-12 pt-14 pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl font-bold text-gray-50">{user.name || "Explorer"}</h1>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">@{user.email?.split('@')[0] || "user"}</p>
                    {user.bio && (
                        <p className="text-sm text-gray-400 mt-2 max-w-md leading-relaxed">
                            {user.bio}
                        </p>
                    )}
                </div>

                <div className="flex gap-3 flex-shrink-0">
                    <Link href="/settings" className="px-4 py-2 text-sm border border-gray-700 text-gray-400 rounded-xl hover:border-gray-500 hover:text-gray-200 transition-colors">
                        Edit profile
                    </Link>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 md:px-12">
                <div className="flex gap-8 pb-6 border-b border-gray-800/60">
                    <div>
                        <p className="text-lg font-bold text-gray-50">{savedItems.length}</p>
                        <p className="text-xs text-gray-600 uppercase tracking-widest mt-0.5">Tracked</p>
                    </div>
                    <div>
                        <p className="text-lg font-bold text-gray-50">{lists.length}</p>
                        <p className="text-xs text-gray-600 uppercase tracking-widest mt-0.5">Lists</p>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-6 md:px-12 pb-20 relative z-10">
                {viewingListId ? (
                    <SpecificListView
                        listId={viewingListId}
                        userId={user.id}
                        onBack={() => setViewingListId(null)}
                        onListDeleted={handleListDeleted}
                    />
                ) : (
                    <>
                        <div className="flex gap-6 mt-6 border-b border-gray-800/60">
                            {tabs.map(({ id, label }) => (
                                <button key={id} onClick={() => setActiveTab(id)} className={`py-4 text-sm transition-colors border-b-2 -mb-px ${activeTab === id ? "text-emerald-300 border-emerald-300" : "text-gray-500 border-transparent hover:text-gray-300"}`}>
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div className="py-10">
                            {activeTab === "saved"    && <SavedTab items={savedItems} onEditItem={setEditingItem} />}
                            {activeTab === "lists"    && <ListsTab lists={lists} onAddList={handleCreateList} onViewList={setViewingListId} />}
                            {activeTab === "activity" && <ActivityTab savedItems={savedItems} />}
                        </div>
                    </>
                )}
            </main>

            {editingItem && (
                <EditMediaModal
                    item={editingItem}
                    userLists={lists}
                    onClose={() => setEditingItem(null)}
                    onUpdate={handleUpdateItem}
                    onDelete={handleDeleteItem}
                    onAddToList={handleAddToList}
                />
            )}
        </div>
    );
}