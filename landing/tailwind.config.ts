import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#0f1f35",
        muted: "#536277",
        "safe-bg": "#d6f5e3",
        "safe-ink": "#0a5c35",
        "review-bg": "#fff0c2",
        "review-ink": "#7a4c00",
        "danger-bg": "#ffe4e3",
        "danger-ink": "#991f1c",
        primary: "#2b6fff",
      },
      backgroundImage: {
        "page-gradient": "linear-gradient(160deg, #edf1f8, #e6ecf5)",
        "shield-gradient": "linear-gradient(135deg, #2b6fff, #1a4fcc)",
      },
      borderRadius: {
        card: "20px",
        "card-lg": "24px",
        btn: "12px",
        "btn-lg": "14px",
      },
      boxShadow: {
        card: "0 2px 20px rgba(15, 31, 53, 0.08)",
        "card-hover": "0 8px 40px rgba(15, 31, 53, 0.14)",
        overlay: "0 4px 32px rgba(15, 31, 53, 0.18)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
