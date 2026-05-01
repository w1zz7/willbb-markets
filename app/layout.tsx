import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "willBB Markets Terminal",
  description:
    "Bloomberg-style markets terminal — 4-tier data failover (Yahoo · CoinGecko · Alpha Vantage · Stooq), 5-second real-time chart polling, 18 quant primitives, Pine-DSL backtester with walk-forward CV, Carhart 4-factor PnL attribution.",
  keywords: [
    "trading terminal",
    "Bloomberg",
    "markets",
    "quant",
    "real-time charts",
    "Alpha Vantage",
    "Yahoo Finance",
    "Carhart 4-factor",
    "Yang-Zhang volatility",
    "ACF PACF",
    "Hurst exponent",
  ],
  authors: [{ name: "Will Zhang", url: "https://www.linkedin.com/in/willzhang6200" }],
  openGraph: {
    title: "willBB Markets Terminal",
    description:
      "Bloomberg-style markets terminal with real-time charts, quant primitives, and a Pine-DSL backtester. Built on a 4-tier free-data failover.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#151518",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#151518",
          color: "#FFFFFF",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        {children}
      </body>
    </html>
  );
}
