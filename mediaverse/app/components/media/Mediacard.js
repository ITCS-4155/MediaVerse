// components/media/MediaCard.js
// Reusable card for each media category used on the landing page.
//
// Usage:
//   import { MediaCard, MediaCardGrid } from "@/components/media/MediaCard";
//   import { mediaThemes } from "@/components/media/mediaThemes";
//
//   <MediaCard theme={mediaThemes[0]} />
//   <MediaCard theme={mediaThemes[0]} size="lg" />
//   <MediaCard theme={mediaThemes[0]} showBrowseLink={false} />
//   <MediaCardGrid />

"use client";

import { useState } from "react";
import Link from "next/link";
import { mediaThemes, CheckIcon, ArrowRight } from "./Mediathemes";

// ── MediaCard ─────────────────────────────────────────────────────────────────
// Props:
//   theme         — theme object from mediaThemes.js (required)
//   size          — "sm" | "md" (default) | "lg"
//   showBrowseLink — show "Browse →" on hover (default: true)
//   browseHref    — override link target (default: /explore?category=<id>)
//   onClick       — optional click handler
//   className     — extra class string

export function MediaCard({
  theme,
  size = "md",
  showBrowseLink = true,
  browseHref,
  onClick,
  className = "",
}) {
  const [hovered, setHovered] = useState(false);

  const href = browseHref ?? `/explore?category=${theme.id}`;

  const padding =
    size === "sm" ? "p-4" :
    size === "lg" ? "p-9" :
    "p-7";

  const titleSize =
    size === "sm" ? "text-base" :
    size === "lg" ? "text-2xl" :
    "text-xl";

  const iconBoxSize =
    size === "sm" ? "w-9 h-9" :
    size === "lg" ? "w-14 h-14" :
    "w-11 h-11";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-500 ${onClick ? "cursor-pointer" : "cursor-default"} ${className}`}
      style={{
        background: theme.bg,
        border: `1px solid ${hovered ? theme.accent : theme.border}`,
        boxShadow: hovered
          ? `0 0 40px ${theme.accentGlow}, inset 0 0 60px ${theme.accentSoft}`
          : "none",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-0.5 w-full transition-opacity duration-300"
        style={{ backgroundColor: theme.accent, opacity: hovered ? 1 : 0.4 }}
      />

      <div className={padding}>

        {/* Header: icon + label + browse link */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className={`${iconBoxSize} rounded-xl flex items-center justify-center shrink-0 transition-all duration-300`}
              style={{
                backgroundColor: theme.accentSoft,
                border: `1px solid ${theme.border}`,
                color: theme.accent,
                boxShadow: hovered ? `0 0 16px ${theme.accentGlow}` : "none",
              }}
            >
              {size === "lg" ? theme.iconLg : theme.icon}
            </div>
            <div>
              <p
                className="text-sm font-bold leading-tight"
                style={{ color: theme.text, fontFamily: theme.font }}
              >
                {theme.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: theme.sub }}>
                {theme.count}
              </p>
            </div>
          </div>

          {showBrowseLink && (
            <Link
              href={href}
              className="flex items-center gap-1 text-xs font-semibold transition-all duration-200"
              style={{
                color: theme.accent,
                opacity: hovered ? 1 : 0,
                pointerEvents: hovered ? "auto" : "none",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              Browse <ArrowRight />
            </Link>
          )}
        </div>

        {/* Tagline */}
        <h3
          className={`${titleSize} font-bold leading-snug mb-4`}
          style={{ color: theme.text, fontFamily: theme.font }}
        >
          {theme.tagline}
        </h3>

        {/* Stats chips */}
        <div className="flex flex-wrap gap-1.5">
          {theme.stats.map((stat) => (
            <span
              key={stat}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={{
                backgroundColor: theme.accentSoft,
                border: `1px solid ${theme.border}`,
                color: theme.sub,
              }}
            >
              <CheckIcon /> {stat}
            </span>
          ))}
        </div>

        {/* Large size: show subcategories */}
        {size === "lg" && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {theme.subcategories.slice(0, 6).map((sub) => (
              <span
                key={sub}
                className="px-2.5 py-1 rounded-full text-[11px]"
                style={{
                  border: `1px solid ${theme.border}`,
                  color: theme.sub,
                }}
              >
                {sub}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Decorative background icon */}
      <div
        className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: hovered ? 0.1 : 0.05,
          color: theme.accent,
          transform: "scale(4) translate(30%, 30%)",
        }}
      >
        {theme.icon}
      </div>
    </div>
  );
}

// ── MediaCardGrid ─────────────────────────────────────────────────────────────
// Renders all media cards in a responsive 3-column grid.
//
// Props:
//   themes       — array of theme objects (default: all from mediaThemes.js)
//   size         — "sm" | "md" (default) | "lg"
//   showBrowseLink — passed through to each MediaCard
//   onCardClick  — called with the theme object when a card is clicked
//   className    — extra class string for the grid wrapper

export function MediaCardGrid({
  themes,
  size = "md",
  showBrowseLink = true,
  onCardClick,
  className = "",
}) {
  const list = themes ?? mediaThemes;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ${className}`}>
      {list.map((theme) => (
        <MediaCard
          key={theme.id}
          theme={theme}
          size={size}
          showBrowseLink={showBrowseLink}
          onClick={onCardClick ? () => onCardClick(theme) : undefined}
        />
      ))}
    </div>
  );
}