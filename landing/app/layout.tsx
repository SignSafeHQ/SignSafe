import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SignSafe — Know what you're signing",
  description:
    "SignSafe intercepts every Solana wallet request, simulates the transaction on-chain, and shows you an AI-powered plain-English verdict before the popup appears. Stay safe from wallet drainers and scams.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  keywords: [
    "Solana",
    "wallet security",
    "transaction analysis",
    "crypto safety",
    "Phantom",
    "Solflare",
    "Chrome extension",
  ],
  openGraph: {
    title: "SignSafe — Know what you're signing",
    description:
      "AI-powered transaction analysis for Solana. See exactly what every signing request does before you approve it.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-page-gradient min-h-screen">{children}</body>
    </html>
  );
}
