function ShieldLogo({ size = 28 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center flex-shrink-0"
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
      >
        <path
          d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V6L12 2z"
          fill="white"
        />
      </svg>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
    </svg>
  );
}

function ChromeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8h9.27M4.27 14L8.5 6.5M8.5 17.5l4.23 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="py-14 px-5 sm:px-8"
      style={{ borderTop: "1px solid rgba(15,31,53,0.08)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
            <a href="#" className="flex items-center gap-2.5">
              <ShieldLogo size={30} />
              <span
                className="text-lg font-bold tracking-tight"
                style={{ color: "#0f1f35" }}
              >
                SignSafe
              </span>
            </a>
            <p
              className="text-sm max-w-xs"
              style={{ color: "#536277" }}
            >
              Built for Solana users who want to stay safe. Know what you&apos;re
              signing before you sign it.
            </p>
            <p className="text-xs" style={{ color: "#8fa3bb" }}>
              Open source &middot; MIT License
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex items-center gap-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                style={{ color: "#536277" }}
              >
                <GitHubIcon />
                GitHub
              </a>
              <a
                href="#install"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                style={{ color: "#536277" }}
              >
                <ChromeIcon />
                Chrome Web Store
              </a>
            </div>

            <a
              href="#install"
              className="flex items-center gap-2 px-5 py-2.5 rounded-btn text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
              style={{ background: "#2b6fff" }}
            >
              Add to Chrome — it&apos;s free
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{
            borderTop: "1px solid rgba(15,31,53,0.07)",
            color: "#8fa3bb",
          }}
        >
          <p>&copy; {year} SignSafe. MIT License.</p>
          <p>
            Not affiliated with Solana Foundation, Phantom, Solflare, or Backpack.
          </p>
        </div>
      </div>
    </footer>
  );
}
