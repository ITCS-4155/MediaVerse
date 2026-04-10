"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MediaCardGrid } from "../components/media/Mediacard";
import { ArrowRight, CheckIcon, StarIcon } from "../components/media/Mediathemes";

const testimonials = [
  { name: "Maya S.",   handle: "@mayastreams",  text: "Mediaverse replaced five different apps. I can't believe I went so long without it.", emoji: "🎬" },
  { name: "Jordan K.", handle: "@jordanreads",  text: "Finally a place to track reading AND my gaming backlog. The cross-media insights are wild.", emoji: "📚" },
  { name: "Priya T.",  handle: "@priyalistens", text: "The podcast + music tracking combo is genuinely something I didn't know I needed.", emoji: "🎧" },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);


const [currentUser, setCurrentUser] = useState(null);
useEffect(() => {
  fetch("/api/me")
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => setCurrentUser(data?.user ?? null))
    .catch(() => setCurrentUser(null));
}, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen bg-[#06080f] text-gray-50 overflow-x-hidden font-serif">
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(110,231,183,0.07) 0%, transparent 60%)" }} />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#06080f]/90 backdrop-blur-md border-b border-gray-800/50" : ""}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 inline-block" />
            <span className="text-xs tracking-[0.18em] uppercase text-emerald-300 font-semibold">mediaverse</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#media" className="hover:text-gray-100 transition-colors">Media</a>
            <a href="#features" className="hover:text-gray-100 transition-colors">Features</a>
            <a href="#reviews" className="hover:text-gray-100 transition-colors">Reviews</a>
           <Link href="/profile/mayastreams" className="text-emerald-300 hover:text-emerald-200 transition-colors">
  Profile
</Link>
          </div>
          <div className="flex items-center gap-3">
            {/* <Link href="/login" className="text-sm text-gray-400 hover:text-gray-100 transition-colors px-3 py-1.5">Sign in</Link>
            <Link href="/login" className="text-sm font-bold px-4 py-2 bg-emerald-300 text-[#06080f] rounded-lg hover:bg-emerald-200 transition-colors">
                Sign in
            </Link> */}
            
          <Link href="/profile/mayastreams" className="w-8 h-8 rounded-full bg-emerald-900/60 border border-emerald-800 flex items-center justify-center text-xs font-bold text-emerald-300 hover:bg-emerald-900 transition-colors">
  MS
</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/5 text-emerald-300 text-xs tracking-widest uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
          Universal Media Tracker
        </div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.02] max-w-5xl mb-6">
          Every story<br /><span className="text-emerald-300">you love,</span><br />one place.
        </h1>
        <p className="text-lg text-gray-400 max-w-xl leading-relaxed mb-12">
          Movies, music, books, games, podcasts— Mediaverse is the universal tracker for everything you watch, read, play, and hear.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <Link href="/signup" className="flex items-center gap-2 px-8 py-4 bg-emerald-300 text-[#06080f] rounded-xl font-bold text-sm hover:bg-emerald-200 transition-colors shadow-[0_0_40px_rgba(110,231,183,0.2)]">
            Start for free <ArrowRight />
          </Link>
        </div>
        <p className="text-xs text-gray-600">No credit card required · All 6 media types · Free forever</p>
      </section>

      {/* Media Cards — uses reusable MediaCardGrid */}
      <section id="media" className="relative z-10 px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-widest uppercase text-emerald-300 mb-3">Six worlds to explore</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Every medium has its own identity</h2>
            <p className="text-gray-500 mt-3 text-sm max-w-md mx-auto">
              Each media type has its own visual language — because tracking a movie feels different from tracking a book.
            </p>
          </div>
          {/* Drop-in reusable component — all 6 themed cards */}
          <MediaCardGrid />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-28 px-6 border-t border-gray-800/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-widest uppercase text-emerald-300 mb-3">Why Mediaverse</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Built for obsessive<br />media lovers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Universal library",     desc: "One home for everything you've watched, read, played, and heard.", accent: "#6ee7b7" },
              { title: "Smart recommendations", desc: "The more you track, the better we know your taste.",               accent: "#f59e0b" },
              { title: "Progress tracking",      desc: "Log where you are across every medium — never lose your place.",  accent: "#a78bfa" },
              { title: "Social lists",           desc: "Share lists, see what friends love, get trusted recs.",           accent: "#f87171" },
            ].map(({ title, desc, accent }) => (
              <div key={title} className="relative p-6 rounded-2xl border border-gray-800 bg-gray-900/30 overflow-hidden hover:border-gray-700 transition-colors">
                <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundColor: accent }} />
                <div className="w-2 h-2 rounded-full mb-4 mt-1" style={{ backgroundColor: accent }} />
                <h3 className="text-sm font-bold text-gray-100 mb-2">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="relative z-10 py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-widest uppercase text-emerald-300 mb-3">Reviews</p>
            <h2 className="text-4xl font-bold tracking-tight">Loved by trackers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, handle, text, emoji }) => (
              <div key={name} className="p-7 rounded-2xl border border-gray-800 bg-gray-900/30 flex flex-col gap-4">
                <div className="flex gap-0.5 text-amber-400">{[...Array(5)].map((_, i) => <StarIcon key={i} />)}</div>
                <p className="text-sm text-gray-300 leading-relaxed flex-1">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-800">
                  <span className="text-2xl">{emoji}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-100">{name}</p>
                    <p className="text-xs text-gray-500">{handle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative rounded-3xl border border-emerald-300/15 p-14 overflow-hidden"
            style={{ background: "radial-gradient(ellipse at top, rgba(110,231,183,0.05) 0%, transparent 60%)" }}>
            <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-emerald-300/20 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b border-r border-emerald-300/20 rounded-br-3xl" />
            <p className="text-xs tracking-widest uppercase text-emerald-300 mb-4">Free forever</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Six worlds.<br /><span className="text-emerald-300">One home.</span></h2>
            <p className="text-gray-400 mb-10 leading-relaxed">Join 2 million people who track what they love — movies, music, books, games, podcasts, and sports.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <Link href="/signup" className="px-8 py-4 border border-gray-700 text-gray-300 rounded-xl text-sm hover:border-gray-500 hover:text-white transition-colors">
                  Create free account
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-gray-600">
              {["No credit card", "All 6 media types", "Unlimited tracking", "Cross-device sync"].map((p) => (
                <span key={p} className="flex items-center gap-1.5"><span className="text-emerald-400"><CheckIcon /></span>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-300 inline-block" />
            <span className="text-xs tracking-[0.18em] uppercase text-emerald-300">mediaverse</span>
          </div>
          <p className="text-xs text-gray-600">© 2026 Mediaverse. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-gray-600">
            {["Privacy", "Terms", "Contact"].map((l) => <a key={l} href="#" className="hover:text-gray-400 transition-colors">{l}</a>)}
          </div>
        </div>
      </footer>
    </div>
  );
}