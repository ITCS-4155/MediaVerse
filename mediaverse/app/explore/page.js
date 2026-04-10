"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import { mediaThemes, getTheme, ArrowRight, } from "../components/media/Mediathemes";
import { MediaCard } from "../components/media/Mediacard";
import { TrendingList } from "../components/media/Trendingitemcard";
import { useRouter } from "next/navigation";

function getInitials(name) {
    if (!name) return "US";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export default function ExplorePage() {
  const [activeId, setActiveId] = useState("film");
  const [currentUser, setCurrentUser] = useState(null);
  const current = getTheme(activeId);
  const router = useRouter();

    useEffect(() => {
        fetch("/api/me")
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => setCurrentUser(data?.user ?? null))
            .catch(() => setCurrentUser(null));
    }, []);

  const handleAdd = (item) => {
    // TODO: wire to your tracking API
    console.log("Adding to tracker:", item.title);
  };

    const navigateToSearch = (genre = "") => {
        const url = `/search?type=${activeId}${genre ? `&genre=${encodeURIComponent(genre)}` : ""}`;
        router.push(url);
    };

  return (
    <div
      className="min-h-screen font-serif overflow-x-hidden transition-colors duration-500"
      style={{ backgroundColor: current.bg.includes("gradient") ? "#060810" : current.bg, color: current.text }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0 transition-all duration-700"
        style={{ background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${current.accentSoft} 0%, transparent 60%)` }} />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{ backgroundColor: `#060810f0`, borderBottom: `1px solid ${current.border}`, backdropFilter: "blur(12px)" }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full inline-block transition-colors duration-500" style={{ backgroundColor: current.accent }} />
            <span className="text-xs tracking-[0.18em] uppercase font-semibold transition-colors duration-500" style={{ color: current.accent }}>
              mediaverse
            </span>
          </Link>

          {/* Category tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {mediaThemes.map((t) => (
              <button key={t.id} onClick={() => setActiveId(t.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200"
                style={{
                  backgroundColor: activeId === t.id ? t.accentSoft : "transparent",
                  border: `1px solid ${activeId === t.id ? t.border : "transparent"}`,
                  color: activeId === t.id ? t.accent : "rgba(255,255,255,0.3)",
                }}>
                <span>{t.icon}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

            <Link href="/profile"
                  className="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all duration-300 hover:scale-105"
                  style={{
                      backgroundColor: current.accentSoft,
                      borderColor: current.border,
                      color: current.accent
                  }}
                  title={currentUser?.name || "Your Profile"}
            >
                {currentUser?.name ? getInitials(currentUser.name) : "US"}
            </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20">

          {/* Section header */}
          <div className="mb-10">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">

                  {/* Icon and Text */}
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500"
                           style={{ backgroundColor: current.accentSoft, border: `1px solid ${current.border}`, color: current.accent }}>
                          {current.icon}
                      </div>
                      <div>
                          <h1 className="text-3xl font-bold tracking-tight transition-colors duration-500"
                              style={{ color: current.text, fontFamily: current.font }}>
                              {current.label}
                          </h1>
                          <p className="text-xs transition-colors duration-500" style={{ color: current.sub }}>
                              Browse and track your favorites
                          </p>
                      </div>
                  </div>

                  {/* Search Button */}
                  <button
                      onClick={() => navigateToSearch()}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:opacity-80 hover:scale-105 shadow-lg"
                      style={{
                          backgroundColor: current.accent,
                          color: "#060810",
                          boxShadow: `0 4px 20px -5px ${current.accent}`
                      }}
                  >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      Search {current.label}
                  </button>
              </div>

          {/* Subcategory pills */}
            <div className="flex flex-wrap gap-2 mt-5">
                <button
                    onClick={() => navigateToSearch()}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer hover:opacity-80"
                    style={{ backgroundColor: current.accentSoft, border: `1px solid ${current.border}`, color: current.accent }}>
                    All
                </button>
                {current.subcategories.map((sub) => (
                    <button key={sub}
                            onClick={() => navigateToSearch(sub)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer hover:opacity-80"
                            style={{ border: `1px solid ${current.border}`, color: current.sub, backgroundColor: "transparent" }}>
                        {sub}
                    </button>
                ))}
            </div>
        </div>

        {/* Trending — uses reusable TrendingList */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold tracking-widest uppercase transition-colors duration-500"
              style={{ color: current.accent }}>
              Trending now
            </h2>
            <button className="flex items-center gap-1 text-xs transition-colors duration-300 hover:opacity-70"
              style={{ color: current.sub }}>
              See all <ArrowRight />
            </button>
          </div>

          {/* Reusable TrendingList — renders ranked items with add buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TrendingList theme={current} limit={3} offset={0} onAdd={handleAdd} />
            <TrendingList theme={current} limit={3} offset={3} onAdd={handleAdd} />
          </div>
        </div>

        {/* Featured card for current category — uses reusable MediaCard */}
        <div className="mb-14">
          <h2 className="text-sm font-bold tracking-widest uppercase mb-5 transition-colors duration-500"
            style={{ color: current.accent }}>
            About this category
          </h2>
          {/* Reusable MediaCard — full-width, large size */}
          <MediaCard theme={current} size="lg" showBrowseLink={false} />
        </div>

        {/* All categories strip — uses reusable MediaCard (sm size) */}
        <div className="border-t pt-10" style={{ borderColor: current.border }}>
          <p className="text-xs tracking-widest uppercase mb-5 transition-colors duration-500" style={{ color: current.sub }}>
            All categories
          </p>
          {/* ✅ Reusable MediaCard (sm) for each category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaThemes.map((t) => (
              <MediaCard
                key={t.id}
                theme={t}
                size="sm"
                showBrowseLink={false}
                onClick={() => setActiveId(t.id)}
                className={activeId === t.id ? "ring-1" : ""}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}