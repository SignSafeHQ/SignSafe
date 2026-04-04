import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--app-font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "var(--ink)",
        muted: "var(--muted)",
        "safe-bg": "var(--safe-bg)",
        "safe-ink": "var(--safe-ink)",
        "review-bg": "var(--review-bg)",
        "review-ink": "var(--review-ink)",
        "danger-bg": "var(--danger-bg)",
        "danger-ink": "var(--danger-ink)",
        primary: "var(--primary)",
      },
      backgroundImage: {
        "page-gradient": "var(--page-gradient)",
        "shield-gradient": "var(--shield-gradient)",
      },
      borderRadius: {
        card: "var(--app-radius-card)",
        "card-lg": "var(--app-radius-card-lg)",
        btn: "var(--app-radius-btn)",
        "btn-lg": "var(--app-radius-btn-lg)",
      },
      boxShadow: {
        card: "var(--app-shadow-card)",
        "card-hover": "var(--app-shadow-card-hover)",
        overlay: "var(--app-shadow-overlay)",
      },
      animation: {
        "fade-up": "var(--app-animate-fade-up)",
        "fade-in": "var(--app-animate-fade-in)",
      },
    },
  },
  plugins: [],
};

export default config;
