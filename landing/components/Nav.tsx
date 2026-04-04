"use client";

import { useState, useEffect } from "react";

function ShieldLogo({ size = 32 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #2b6fff, #1a4fcc)",
        borderRadius: Math.round(size * 0.28),
      }}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V6L12 2z"
          fill="white"
        />
      </svg>
    </div>
  );
}

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
          <ShieldLogo size={34} />
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
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.25" />
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8l7 4-7 4z"
              fill="white"
            />
          </svg>
          Add to Chrome
        </a>
      </div>
    </header>
  );
}
