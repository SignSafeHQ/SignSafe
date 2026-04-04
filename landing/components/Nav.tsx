"use client";

import { useState, useEffect } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "shadow-sm border-b border-white/60"
          : "border-b border-transparent"
      }`}
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        backgroundColor: scrolled
          ? "rgba(255, 255, 255, 0.85)"
          : "rgba(255, 255, 255, 0.5)",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <span className="text-2xl leading-none" aria-hidden="true">
            🛡️
          </span>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: "#0f1f35" }}
          >
            SignSafe
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-sm font-medium transition-colors hover:text-primary"
            style={{ color: "#536277" }}
          >
            How it works
          </a>
          <a
            href="#scenarios"
            className="text-sm font-medium transition-colors hover:text-primary"
            style={{ color: "#536277" }}
          >
            Examples
          </a>
          <a
            href="#features"
            className="text-sm font-medium transition-colors hover:text-primary"
            style={{ color: "#536277" }}
          >
            Features
          </a>
        </nav>

        <a
          href="#install"
          className="flex items-center gap-2 px-4 py-2 rounded-btn text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-md active:scale-95"
          style={{ background: "#2b6fff" }}
        >
          <span className="text-sm leading-none" aria-hidden="true">
            🛡️
          </span>
          Install free
        </a>
      </div>
    </header>
  );
}
