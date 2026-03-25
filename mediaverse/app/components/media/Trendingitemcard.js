// components/media/TrendingItemCard.js
// Reusable row card for individual trending items in the explore page.
//
// Usage:
//   import { TrendingItemCard, TrendingList } from "@/components/media/TrendingItemCard";
//
//   <TrendingItemCard
//     item={{ title: "Dune: Part Two", meta: "2024 · Sci-Fi", rating: "8.5" }}
//     rank={1}
//     theme={filmTheme}
//     onAdd={(item) => console.log("added", item)}
//   />
//
//   <TrendingList theme={filmTheme} limit={3} onAdd={(item) => console.log(item)} />

"use client";

import { useState } from "react";
import { PlusIcon } from "./Mediathemes";

// ── TrendingItemCard ──────────────────────────────────────────────────────────
// Props:
//   item      — { title, meta, rating } (required)
//   rank      — 1-based rank number shown on the left (required)
//   theme     — media category theme object for colors (required)
//   onAdd     — called with the item object when + is clicked
//   className — extra class string

export function TrendingItemCard({
  item,
  rank,
  theme,
  onAdd,
  className = "",
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300 cursor-default ${className}`}
      style={{
        border: `1px solid ${hovered ? theme.accent : theme.border}`,
        backgroundColor: hovered ? theme.accentSoft : "rgba(255,255,255,0.02)",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
      }}
    >
      {/* Rank number */}
      <span
        className="text-2xl font-black w-8 shrink-0 transition-colors duration-300 select-none"
        style={{
          color: hovered ? theme.accent : "rgba(255,255,255,0.1)",
          fontFamily: theme.font,
        }}
      >
        {String(rank).padStart(2, "0")}
      </span>

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-bold truncate transition-colors duration-300"
          style={{ color: theme.text, fontFamily: theme.font }}
        >
          {item.title}
        </p>
        <p
          className="text-xs truncate transition-colors duration-300"
          style={{ color: theme.sub }}
        >
          {item.meta}
        </p>
      </div>

      {/* Rating */}
      <div className="flex items-baseline gap-0.5 shrink-0">
        <span
          className="text-xs font-bold transition-colors duration-300"
          style={{ color: theme.accent }}
        >
          {item.rating}
        </span>
        <span className="text-[10px]" style={{ color: theme.sub }}>
          /10
        </span>
      </div>

      {/* Add button — slides in on hover */}
      <button
        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
        style={{
          backgroundColor: theme.accent,
          color: "#060810",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "scale(1)" : "scale(0.8)",
          pointerEvents: hovered ? "auto" : "none",
        }}
        aria-label={`Add ${item.title} to tracker`}
        onClick={(e) => {
          e.stopPropagation();
          onAdd?.(item);
        }}
      >
        <PlusIcon />
      </button>
    </div>
  );
}

// ── TrendingList ──────────────────────────────────────────────────────────────
// Renders a full ranked trending list for a given theme.
//
// Props:
//   theme     — media category theme object (required)
//   limit     — max items to show (default: all)
//   onAdd     — called with item when + is clicked
//   className — extra class string for the wrapper

export function TrendingList({
  theme,
  limit,
  onAdd,
  className = "",
}) {
  const items = limit ? theme.trending.slice(0, limit) : theme.trending;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {items.map((item, i) => (
        <TrendingItemCard
          key={item.title}
          item={item}
          rank={i + 1}
          theme={theme}
          onAdd={onAdd}
        />
      ))}
    </div>
  );
}