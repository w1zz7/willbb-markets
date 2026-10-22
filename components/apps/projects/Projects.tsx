"use client";

import type { WindowState } from "@/lib/wm/types";
import { openApp } from "@/lib/wm/registry";
import type { AppId } from "@/lib/wm/types";

interface Card {
  appId: AppId;
  label: string;
  summary: string;
  metric: string;
  icon: string;
  /** Flagship project — rendered larger with a standout border + badge. */
  featured?: boolean;
}

const CARDS: Card[] = [
  {
    appId: "competitions",
    label: "Case Competitions & Hackathons",
    summary:
      "PGA Marketing Crisis, Philly CodeFest (1st · $3k), Jane Street Estimathon (3rd), NJ Esports State Champion ($40k pool), Howley Finance, DSAB Equity, Deloitte Datathon, BCG × Aramark, UEV, and more - with photos from each event.",
    metric: "14 events · 8 finalist/podium finishes · $43k+ prize money",
    icon: "/icons/trophy.svg",
  },
  {
    appId: "philaision",
    label: "PhilAIsion (Philly CodeFest 2026 Winner)",
    summary:
      "AI civic agent on a $50 Raspberry Pi 4 kiosk; 700+ city services across 10 languages.",
    metric: "1st place · $3,000 winner share",
    icon: "/icons/trophy.svg",
  },
  {
    appId: "willbb",
    label: "WillBB Markets Terminal",
    summary:
      "A Bloomberg-style quant terminal I built end-to-end: live multi-asset data with 4-tier failover, a 14-tab equity research suite, and a quant lab with PSR/DSR, Carhart 4-factor, Newey-West HAC, walk-forward CV, and a strategy backtester.",
    metric: "Live terminal · custom quant engine · the project I'm most proud of",
    icon: "/icons/willbb.svg",
    featured: true,
  },
  {
    appId: "golfdatalab",
    label: "Golf Data Lab",
    summary:
      "Interactive analysis of three golf datasets, including 36,864 rows of PGA Tour strokes-gained data. Four tabs: exploratory analysis, a 3D Three.js scatter plot, an in-browser logistic-regression predictor, and SG-Total leaderboards.",
    metric: "3 datasets · 45k+ rows · in-browser ML + 3D viz",
    icon: "/icons/golf-data-lab.svg",
  },
  {
    appId: "strategy",
    label: "Trading Strategy",
    summary:
      "My full trading playbook: fundamentals, trend and moving averages, momentum (RSI/MACD), volume, and support and resistance, plus a mean-reversion system and an options setups hierarchy.",
    metric: "Trend · momentum · mean reversion · options",
    icon: "/icons/strategy.svg",
  },
  {
    appId: "stock-portfolio",
    label: "Stock Portfolio Management",
    summary:
      "Macro swing trading with strict Excel-validated strategy: S/R levels, moving averages, momentum.",
    metric: "63.98% gain ratio · $315,020 processed · 267 trades",
    icon: "/icons/chart.svg",
  },
  {
    appId: "market-recaps",
    label: "Market Journal - Daily Log",
    summary:
      "Daily + weekly journal entries (Jan – Apr 2026): Dow/S&P/Nasdaq moves, macro, sectors, crypto, TL;DR. The research layer behind the trades.",
    metric: "~50 entries · Jan – Apr 2026",
    icon: "/icons/news.svg",
  },
  {
    appId: "patent",
    label: "CNIPA Utility Model Patent",
    summary:
      "Co-invented a water-resistant golf bag innovation addressing durability gaps in existing gear.",
    metric: "China IP · Sept 2024",
    icon: "/icons/cert.svg",
  },
  {
    appId: "speaking",
    label: "Public Speaking",
    summary:
      "Invited talks at Drexel LeBow (BUSN 101/102), competition pitches (PGA, Howley, DSAB, Philly CodeFest, BCG × Aramark, UEV, Deloitte Datathon, Baiada), and Bulletproof AI launch demos.",
    metric: "11 events · 1,400+ students reached · 5 finalist/1st-place finishes",
    icon: "/icons/mic.svg",
  },
  {
    appId: "bulletproof",
    label: "Bulletproof AI",
    summary:
      "Full-stack Next.js platform with RAG + ATS model trained on 200k resumes. 11 AI tools in production.",
    metric: "75,000+ req/mo",
    icon: "/icons/app-exe.svg",
  },
];

export default function Projects({ window: _ }: { window: WindowState }) {
  return (
    <div className="flex flex-col h-full overflow-auto win-scroll p-[10px] gap-[8px]">
      {CARDS.map((c) => (
        <button
          key={c.appId}
          type="button"
          className={
            "win-window relative flex items-start gap-[10px] p-[10px] text-left " +
            (c.featured ? "hover:brightness-[1.03]" : "hover:bg-[#e0e0e0]")
          }
          style={
            c.featured
              ? {
                  border: "3px solid #000080",
                  background:
                    "linear-gradient(135deg, #fff8da 0%, #e8f1ff 60%, #dbe8ff 100%)",
                  boxShadow:
                    "0 0 0 2px #f5c518, 3px 3px 0 rgba(0,0,0,0.28)",
                }
              : undefined
          }
          onClick={() => openApp(c.appId)}
        >
          {c.featured && (
            <span
              className="absolute"
              style={{
                top: -2,
                right: -2,
                background: "#000080",
                color: "#f5c518",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.06em",
                padding: "3px 10px",
                boxShadow: "-1px 1px 0 rgba(0,0,0,0.25)",
              }}
            >
              ★ MOST PROUD BUILD
            </span>
          )}
          <img
            src={c.icon}
            alt=""
            width={c.featured ? 58 : 48}
            height={c.featured ? 58 : 48}
            className="pixelated shrink-0 mt-[2px]"
            style={{ imageRendering: "pixelated" }}
          />
          <div className="flex-1 min-w-0">
            <div
              className={
                c.featured
                  ? "font-extrabold text-[24px] text-[#000080] tracking-tight"
                  : "font-bold text-[18px]"
              }
            >
              {c.label}
            </div>
            <div className="text-[20px] leading-snug mt-[2px]">{c.summary}</div>
            <div
              className={
                "font-bold mt-[4px] text-[#000080] " +
                (c.featured ? "text-[21px]" : "text-[20px]")
              }
            >
              {c.metric}
            </div>
          </div>
          <div className="text-[#000080] font-bold pr-[4px] self-center">Open →</div>
        </button>
      ))}
    </div>
  );
}
