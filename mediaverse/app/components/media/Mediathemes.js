// components/media/mediaThemes.js
// Single source of truth for all media category themes, icons, and data.
// Import from here in any page or component that needs media type info.

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

// ── Icons ─────────────────────────────────────────────────────────────────────

export const FilmIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2"/>
    <line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <line x1="2" y1="7" x2="7" y2="7"/><line x1="17" y1="7" x2="22" y2="7"/>
    <line x1="17" y1="17" x2="22" y2="17"/><line x1="2" y1="17" x2="7" y2="17"/>
  </svg>
);

export const MusicIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
  </svg>
);

export const BookIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

export const GameIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"/>
    <line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/>
    <circle cx="15" cy="12" r="1" fill="currentColor"/>
    <circle cx="18" cy="10" r="1" fill="currentColor"/>
  </svg>
);

export const PodcastIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="11" r="1"/>
    <path d="M11 17.93A8 8 0 1 1 13 17.93"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
  </svg>
);

// ── Shared UI icons ───────────────────────────────────────────────────────────

export const ArrowRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

export const CheckIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export const PlusIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export const StarIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

// ── Theme data ────────────────────────────────────────────────────────────────

export const mediaThemes = [
  {
    id: "film",
    label: "Movies & TV",
    tagline: "Never lose track of what to watch.",
    count: "500K+ titles",
    icon: <FilmIcon size={20} />,
    iconLg: <FilmIcon size={28} />,
    bg: "linear-gradient(135deg, #1a0505 0%, #2d0a0a 100%)",
    surface: "#130c10",
    border: "rgba(239,68,68,0.25)",
    accent: "#ef4444",
    accentSoft: "rgba(239,68,68,0.12)",
    accentGlow: "rgba(239,68,68,0.2)",
    text: "#fef2f2",
    sub: "#fca5a5",
    font: "Georgia, serif",
    stats: ["IMDb linked", "Watchlists", "Episode tracker"],
    subcategories: ["Action", "Drama", "Comedy", "Sci-Fi", "Horror", "Documentary", "Animation", "Thriller"],
    trending: [
      { title: "Dune: Part Two",    meta: "2024 · Sci-Fi",     rating: "8.5" },
      { title: "The Bear",          meta: "S3 · Drama",        rating: "9.1" },
      { title: "Oppenheimer",       meta: "2023 · Drama",      rating: "8.9" },
      { title: "Shogun",            meta: "2024 · Historical", rating: "9.0" },
      { title: "Poor Things",       meta: "2023 · Fantasy",    rating: "8.3" },
      { title: "The Substance",     meta: "2024 · Horror",     rating: "7.8" },
    ],
  },
  {
    id: "music",
    label: "Music",
    tagline: "Your listening life, in full detail.",
    count: "80M+ tracks",
    icon: <MusicIcon size={20} />,
    iconLg: <MusicIcon size={28} />,
    bg: "linear-gradient(135deg, #021a0e 0%, #052e16 100%)",
    surface: "#0b1210",
    border: "rgba(16,185,129,0.25)",
    accent: "#10b981",
    accentSoft: "rgba(16,185,129,0.12)",
    accentGlow: "rgba(16,185,129,0.2)",
    text: "#ecfdf5",
    sub: "#6ee7b7",
    font: "'Courier New', monospace",
    stats: ["Last.fm sync", "Genre charts", "Scrobbling"],
    subcategories: ["Pop", "Hip-Hop", "Rock", "Electronic", "Jazz", "Classical", "R&B", "Indie"],
    trending: [
      { title: "Short n' Sweet",          meta: "Sabrina Carpenter", rating: "9.2" },
      { title: "Brat",                    meta: "Charli xcx",        rating: "8.8" },
      { title: "GNX",                     meta: "Kendrick Lamar",    rating: "9.4" },
      { title: "The Great Impersonator",  meta: "Halsey",            rating: "8.5" },
      { title: "Manning Fireworks",       meta: "MJ Lenderman",      rating: "8.7" },
      { title: "Bright Future",           meta: "Adrianne Lenker",   rating: "8.9" },
    ],
  },
  {
    id: "books",
    label: "Books",
    tagline: "From your shelf to your soul.",
    count: "35M+ titles",
    icon: <BookIcon size={20} />,
    iconLg: <BookIcon size={28} />,
    bg: "linear-gradient(135deg, #12041a 0%, #1e0a2e 100%)",
    surface: "#110d14",
    border: "rgba(139,92,246,0.25)",
    accent: "#a78bfa",
    accentSoft: "rgba(167,139,250,0.12)",
    accentGlow: "rgba(167,139,250,0.2)",
    text: "#f5f3ff",
    sub: "#c4b5fd",
    font: "Georgia, serif",
    stats: ["Goodreads import", "Reading goals", "Page tracker"],
    subcategories: ["Fiction", "Non-Fiction", "Sci-Fi", "Fantasy", "Mystery", "Biography", "History", "Self-Help"],
    trending: [
      { title: "James",                meta: "Percival Everett",  rating: "9.0" },
      { title: "The Women",            meta: "Kristin Hannah",    rating: "8.6" },
      { title: "All Fours",            meta: "Miranda July",      rating: "8.2" },
      { title: "Intermezzo",           meta: "Sally Rooney",      rating: "8.4" },
      { title: "The God of the Woods", meta: "Liz Moore",         rating: "8.7" },
      { title: "Orbital",              meta: "Samantha Harvey",   rating: "8.9" },
    ],
  },
  {
    id: "games",
    label: "Video Games",
    tagline: "Conquer your backlog. Finally.",
    count: "500K+ games",
    icon: <GameIcon size={20} />,
    iconLg: <GameIcon size={28} />,
    bg: "linear-gradient(135deg, #021016 0%, #041e2a 100%)",
    surface: "#0b1212",
    border: "rgba(6,182,212,0.25)",
    accent: "#22d3ee",
    accentSoft: "rgba(34,211,238,0.1)",
    accentGlow: "rgba(34,211,238,0.2)",
    text: "#ecfeff",
    sub: "#67e8f9",
    font: "'Courier New', monospace",
    stats: ["All platforms", "Playtime log", "Backlog manager"],
    subcategories: ["RPG", "Action", "Strategy", "Indie", "FPS", "Sports", "Adventure", "Simulation"],
    trending: [
      { title: "Elden Ring: Shadow of the Erdtree", meta: "FromSoftware", rating: "9.5" },
      { title: "Balatro",                           meta: "LocalThunk",   rating: "9.3" },
      { title: "Black Myth: Wukong",                meta: "Game Science", rating: "8.8" },
      { title: "Astro Bot",                         meta: "Team Asobi",   rating: "9.4" },
      { title: "Metaphor: ReFantazio",              meta: "Atlus",        rating: "9.2" },
      { title: "UFO 50",                            meta: "Various",      rating: "9.0" },
    ],
  },
  {
    id: "podcasts",
    label: "Podcasts",
    tagline: "Every episode worth remembering.",
    count: "4M+ shows",
    icon: <PodcastIcon size={20} />,
    iconLg: <PodcastIcon size={28} />,
    bg: "linear-gradient(135deg, #14100200 0%, #1c1502 100%)",
    surface: "#120c10",
    border: "rgba(245,158,11,0.25)",
    accent: "#fbbf24",
    accentSoft: "rgba(251,191,36,0.1)",
    accentGlow: "rgba(251,191,36,0.2)",
    text: "#fffbeb",
    sub: "#fcd34d",
    font: "Georgia, serif",
    stats: ["Episode tracking", "Timestamped notes", "Queue manager"],
    subcategories: ["True Crime", "Comedy", "News", "Technology", "Science", "History", "Business", "Culture"],
    trending: [
      { title: "Serial",                       meta: "This American Life",   rating: "9.3" },
      { title: "Conan O'Brien Needs a Friend", meta: "Conan O'Brien",       rating: "9.1" },
      { title: "Huberman Lab",                 meta: "Andrew Huberman",     rating: "8.6" },
      { title: "The Daily",                    meta: "The New York Times",  rating: "8.8" },
      { title: "SmartLess",                    meta: "Bateman/Arnett/Hayes",rating: "8.9" },
      { title: "Radiolab",                     meta: "WNYC Studios",        rating: "9.2" },
    ],
  },
];

// Helper: look up a theme by id
export const getTheme = (id) =>
  mediaThemes.find((t) => t.id === id) ?? mediaThemes[0];