// components/media/TrendingItemCard.js
// Reusable row card for individual trending items in the explore page.

"use client";

import { useState } from "react";
import { PlusIcon } from "./Mediathemes";

export function TrendingItemCard({
                                     item,
                                     rank,
                                     theme,
                                     onAdd,
                                     onItemClick,
                                     className = "",
                                 }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onItemClick?.(item)}
            className={`group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer ${className}`}
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
                    {item.releaseDate ? item.releaseDate.substring(0, 4) : item.meta}
                </p>
            </div>

            {/* Rating */}
            <div className="flex items-baseline gap-0.5 shrink-0">
        <span
            className="text-xs font-bold transition-colors duration-300"
            style={{ color: theme.accent }}
        >
          {item.rating || "-"}
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

export function TrendingList({
                                 theme,
                                 limit,
                                 offset = 0,
                                 onAdd,
                                 onItemClick,
                                 className = "",
                             }) {

    const items = limit
        ? theme.trending.slice(offset, offset + limit)
        : theme.trending.slice(offset);

    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            {items.map((item, i) => (
                <TrendingItemCard
                    key={item.externalId || item.title}
                    item={item}
                    rank={offset + i + 1}
                    theme={theme}
                    onAdd={onAdd}
                    onItemClick={onItemClick}
                />
            ))}
        </div>
    );
}