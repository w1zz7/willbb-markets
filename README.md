# willBB Markets Terminal

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

A **Bloomberg-style markets terminal** built ground-up on free data sources. Self-contained, ~36 source files, no SaaS dependencies, ~160 KB First Load JS. Designed to demonstrate that a real-time quant terminal with a Pine-DSL backtester, Carhart 4-factor regression, and TradingView-grade charts can be built without spending a dollar on data.

> Standalone version of the **willBB** app from [w1zz7/willos-98-portfolio](https://github.com/w1zz7/willos-98-portfolio). Same code, no Win98 desktop chrome — just the terminal, fullscreen.

---

## What it does

Four top tabs, each a real workspace:

### 1. Markets

- **TradingView widget** chart for the focused symbol (real-time, regulated data feed via TradingView)
- **Live ticker tape** at the top: S&P 500, Nasdaq, Dow, Russell 2K, VIX, WTI, Brent, Gold, Silver, EUR/USD, USD/JPY, Bitcoin, Ethereum
- **144-symbol watchlist** with prices polling every 15 seconds
- Click any row → focus that symbol → all other tabs follow

### 2. Equity Research (14 sub-tabs per ticker)

| Sub-tab | Source | What's there |
|---|---|---|
| Profile | Yahoo `/v10/quoteSummary` | Sector, industry, employees, business summary |
| Technicals | embedded TradingView | TV's full studies stack (RSI, MACD, Bollinger, etc.) |
| Statistics | Yahoo modules | Market cap, P/E, EPS, ROE, beta, 52-week range, short interest |
| Income / Balance / Cash Flow | Yahoo modules | 4 years of fundamental statements with TTM column |
| Analysts | Yahoo modules | Recommendation distribution, price targets, upgrades/downgrades |
| Earnings | Yahoo modules | EPS history with surprise % vs estimate |
| Holders | Yahoo modules | Top mutual fund + institutional holders |
| **Smart Money** | Alpha Vantage | Insider transactions (last 50, color-coded buy/sell) + institutional holdings (top 25 by % O/S) side-by-side |
| **Transcript** | Alpha Vantage | Earnings call transcript with paragraph-level LLM sentiment scoring + speaker stats (top 6 by paragraph count) |
| Dividends | Yahoo modules | Yield, payout, ex-date, history |
| Options | Yahoo `/v7/options` | Full chain with greeks (when available), put-call ratios |
| **News + Sentiment** | Alpha Vantage | LLM-tagged ticker sentiment per article + topic chips + aggregate gauge |

### 3. Discovery (3 sub-tabs)

- **Screeners** — Yahoo's `day_gainers` / `day_losers` / `most_actives` predefined screeners as 3 columns
- **Macro** — yield-curve hero (3M / 2Y / 5Y / 7Y / 10Y / 30Y) plus 7 sparklines: Fed Funds Rate, 10Y Treasury, 2Y Treasury, CPI, Inflation YoY, Unemployment, Real GDP. Inversion warning baked in.
- **Calendars** — Earnings calendar (next 3 months) + IPO calendar (next 3 months). Click a row to focus that ticker.

### 4. Research (the quant terminal — 4 panes)

#### Studies
- Symbol header with live ticking price + day-over-day %, source badge
- Hand-rolled SVG candlestick chart (no `lightweight-charts` dep): TradingView-style polish — right-axis price scale, hollow up-candles, faint ticker watermark, pulsing live-tip dot, dashed live-price line, hover crosshair with floating OHLC tooltip showing all overlay values at the hovered bar
- 12 indicator toggles: SMA, EMA, RSI, MACD, ATR, Bollinger Bands, Yang-Zhang vol, Garman-Klass vol, Parkinson vol, close-to-close vol, log returns, rolling beta to ^GSPC
- Quant readouts panel (right rail): Sharpe (1y), Annualized σ, RV YZ, RV GK, β to SPX, Sortino, Information Ratio, Hurst (R/S), ADF stat, ACF(1), with significance bands
- ACF + PACF correlogram bar charts with ±1.96/√N significance bands

#### Cross-Section
- 32-name liquid US large-cap universe
- 4 cross-sectional alpha signals: 12-1 momentum, 1-month reversal, low volatility, drawdown recovery
- Decile-sort + IC + IC decay + L/S equity curve
- 12-asset 60-day return correlation matrix
- Watchlist heatmap with sector rotation

#### Alpha Lab
- **Pine v5-flavored DSL editor** with 6 built-in presets: MA Crossover (50/200), RSI mean-reversion, BB breakout, momentum, carry, two-factor combo
- DSL compiles to JS via `new Function(...)` with helpers `plot/long/short/exit` and full indicator library injected as `ind.*` — write strategy code, hit RUN BACKTEST, see signals overlaid on the chart
- Walk-forward CV (configurable train/test windows that step forward)
- Transaction-cost model: fixed commission + bid-ask half-spread + sqrt market impact (Almgren-Chriss-style) + borrow cost annualized to per-bar
- Results: equity curve, drawdown, Sharpe, Sortino, win rate, profit factor, expectancy, max drawdown, Calmar
- Paper Blotter: every signal generates a paper trade, mark-to-market live

#### PnL Attribution
- Rolling 60-day Sharpe / Sortino / Information Ratio
- Realized vol: Yang-Zhang vs close-to-close
- Drawdown chart with peak/trough markers
- Returns histogram + QQ plot vs normal (visualize tail fatness)
- **Carhart 4-factor regression** of strategy returns on (Mkt-RF / SMB / HML / MOM) reconstructed from ETF spreads:
  - SMB ≈ IWM − SPY (small-minus-big)
  - HML ≈ IUSV − IUSG (high-minus-low book-to-market)
  - MOM ≈ MTUM − SPY (momentum)
- Multivariate OLS via Gauss-Jordan matrix inversion (no math library) with t-stats, R², adjusted R²
- Variance decomp: % systematic vs % idiosyncratic
- Rolling factor exposures (60d windows)
- VaR / Expected Shortfall (95%, 99%) via historical simulation + Cornish-Fisher
- Position sizer: account equity × risk % / stop distance → shares + leverage

---

## Data architecture

A 4-tier provider failover behind every chart and quote, with each response tagged `source` so the UI can show a colored badge:

```
Yahoo Finance v8  →  CoinGecko (crypto)  →  Alpha Vantage  →  Stooq  →  Synthetic
       |                  |                     |                |          |
  rate-limited       real-time spot         daily compact      CSV daily  regime-switching
  retry x4 with      via /simple/price      free 25/day        last-known GBM placeholder
  rotating UA +      (BTC/ETH/SOL/DOGE)     EOD quote +        cached     so panels render
  cookie refresh                            news + macro                  even if all fail
```

Source badge in the header: **LIVE** (green) · **DELAYED** (amber) · **EOD** (purple) · **CACHED** (gray) · **SYNTHETIC** (red).

### Yahoo Finance v8 (primary)
- 4-attempt retry with exponential backoff (350 → 3500 ms)
- Rotating User-Agent pool (Chrome 120/121, Win Chrome, macOS Safari 17.2)
- Cookie auto-refresh from `fc.yahoo.com` (force-refresh on attempt ≥ 2)
- Alternates between `query1.finance.yahoo.com` and `query2.finance.yahoo.com`
- Per-symbol module-scope success cache (90s for charts, 5s/30s split for quotes)

### Alpha Vantage (free 25/day budget)
- Multiplexed `/api/markets/alpha?fn=...` route covers 17 endpoints
- Rolling 24-hour budget guard: caps at 22 calls (3 in reserve)
- 5/min throttle: ≥13s spacing between calls (under the 5/min ceiling with margin)
- Per-endpoint cache TTLs from 5 min (live spot prices) to 30 days (earnings transcripts)
- Symbol translation: `^GSPC → SPY`, `^IXIC → QQQ`, etc. (free tier doesn't ship indices)

### Real-time chart
- `useLiveQuote(symbol, intervalMs=5000)` hook polls `/api/markets/quotes` every 5 seconds
- Splices live tick into the latest candle's close (h/l auto-extend if the print exceeds the daily high/low)
- All downstream computations re-derive: closes, log returns, BB, RSI, MACD, realized vol, Sharpe, ACF/PACF
- Pauses when `document.hidden`; per-symbol AbortController on unmount/symbol-change
- Server-side cache TTL is split: 5s for ≤24-symbol calls (live), 30s for batch (watchlist)

### Stress-tested
- 20-symbol concurrent burst → 12 Yahoo + 8 Stooq, zero degraded
- Rapid symbol switch (4 tickers in 3s) → all in-flight aborted, only the final settles
- 12-poll long session at 5s → no memory leaks, polls keep firing
- Tab backgrounded → polls pause, resume on focus

---

## Quant primitives

`components/apps/willbb/quantdesk/indicators.ts`:

```typescript
// Realized volatility (annualized)
export function realized_vol_cc(closes: number[], n: number): number[]    // close-to-close
export function realized_vol_pk(bars: Bar[], n: number): number[]         // Parkinson (HL)
export function realized_vol_gk(bars: Bar[], n: number): number[]         // Garman-Klass
export function realized_vol_yz(bars: Bar[], n: number): number[]         // Yang-Zhang (full OHLC + overnight)

// Time-series properties
export function log_ret(closes: number[]): (number | null)[]
export function cum_log_ret(closes: number[]): (number | null)[]
export function acf(returns: (number | null)[], maxLag: number): number[]
export function pacf(returns: (number | null)[], maxLag: number): number[]  // Durbin-Levinson
export function hurst(closes: number[]): number                              // R/S analysis
export function adf_stat(closes: number[]): number                           // augmented Dickey-Fuller

// Risk-adjusted return
export function rolling_beta(assetRet: number[], mktRet: number[], n: number): number[]
export function sortino(returns: (number | null)[], n: number): (number | null)[]
export function information_ratio(activeRet: number[], n: number): (number | null)[]

// Cross-section utilities
export function rank(values: number[]): number[]                  // 1-based ranks
export function zscore(values: number[]): number[]
export function winsorize(values: number[], pct: number): number[]
export function pct_change(values: number[]): (number | null)[]
export function rolling_corr(x: number[], y: number[], n: number): number[]
```

Plus 12 retail classics (SMA, EMA, RSI, MACD, ATR, Bollinger, Stochastic, OBV, VWAP, ADX, Donchian, Ichimoku) and helpers (`crossover`, `crossunder`, `highest`, `lowest`).

---

## Backtest engine

`components/apps/willbb/quantdesk/backtest.ts`:

```typescript
runBacktest(bars, signals, params) → BacktestResult
  - Per-bar evaluation
  - Long / short / exit signals
  - Per-trade P&L with: commission + bid-ask half-spread + sqrt market impact + borrow cost
  - Stats: total return, Sharpe, Sortino, win rate, profit factor, expectancy,
    max drawdown, Calmar, exposure %, avg holding period, turnover

runWalkForward(bars, signalFn, trainBars, testBars, stepBars) → WalkForwardResult
  - Train/test windows step forward through history
  - Out-of-sample only — no look-ahead
  - Returns per-window stats + concatenated OOS equity curve
```

Factor regression (`factorRegression.ts`):

```typescript
runFactorRegression(strategyReturns, factors) → FactorRegressionResult
  // OLS with Gauss-Jordan matrix inversion
  // Returns: alpha, betas, t-stats, R², adjusted R², residuals, systematic %

buildFactorReturns({ SPY, IWM, IUSV, IUSG, MTUM }) → CarhartFactors
  // Mkt-RF ≈ SPY (subtract risk-free if available)
  // SMB ≈ IWM - SPY
  // HML ≈ IUSV - IUSG
  // MOM ≈ MTUM - SPY
```

---

## API routes

| Route | Returns | Cache |
|---|---|---|
| `GET /api/markets/chart?symbol=AAPL&range=1y&interval=1d` | OHLCV with 4-tier failover | 90s success / 0 synthetic |
| `GET /api/markets/quotes?symbols=AAPL,MSFT` | Last-price snapshot | 5s ≤24 sym / 30s batch |
| `GET /api/markets/equity?module=profile&symbol=AAPL` | Yahoo modules (profile, statistics, income, balance, cashflow, analysts, earnings, holders, dividends, options, news) | per-module |
| `GET /api/markets/alpha?fn=NEWS_SENTIMENT&tickers=AAPL` | Multiplexed AV endpoint (17 functions) | 5min - 30day per fn |

Diagnostic: `GET /api/markets/alpha?fn=BUDGET` returns `{keyPresent, callsLast24h, budget, canSpend}` without spending a call.

---

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The terminal renders fullscreen.

| Script | What it does |
|---|---|
| `npm run dev` | Next.js dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Run the production build locally |
| `npm run typecheck` | `tsc --noEmit` (0 errors expected) |

### Optional environment variables

```bash
# .env.local
ALPHA_VANTAGE_API_KEY=your_free_key   # https://www.alphavantage.co/support/#api-key
```

Without an AV key:
- News+Sentiment, Symbol Search, Smart Money, Transcript, Macro panel, Calendars all show "unavailable"
- Charts, quotes, equity research, screeners, watchlist, technicals **still work** on Yahoo + Stooq + CoinGecko (zero keys)

---

## Deployment

### Netlify (recommended — `netlify.toml` is included)

`netlify.toml` pins Node 20 LTS and sets cache headers on `/api/markets/*`. Netlify's built-in Next.js Runtime handles SSR pages, the API routes (deployed as on-demand Netlify Functions), and ISR cache headers automatically — no plugin block needed.

```bash
npx netlify-cli login
npx netlify-cli init       # link this folder to a new or existing site
npx netlify-cli deploy --prod
```

Or via the Netlify dashboard:
1. **Add new site → Import from Git → choose this repo**
2. Build settings auto-detect from `netlify.toml` (build cmd `npm run build`, publish `.next`)
3. Optional: add `ALPHA_VANTAGE_API_KEY` under **Site settings → Environment variables** to unlock News+Sentiment, Smart Money, Macro, Calendars, Symbol Search, Transcripts. Without it, those panels show "unavailable" and everything else still works.
4. Deploy. Subsequent pushes to `main` auto-deploy.

### Vercel

```bash
npx vercel --prod
```

No `vercel.json` needed — Next.js conventions are auto-detected. Add `ALPHA_VANTAGE_API_KEY` in the Vercel dashboard's env vars.

### Other Node hosts

Standard Next.js — Railway, Render, Fly all work without changes. Set `ALPHA_VANTAGE_API_KEY` in the host's env config.

---

## Project structure

```
willbb-markets/
├── app/
│   ├── api/markets/
│   │   ├── chart/         # 4-tier OHLCV failover
│   │   ├── quotes/        # split-TTL quote cache
│   │   ├── equity/        # Yahoo modules
│   │   └── alpha/         # multiplexed Alpha Vantage
│   ├── layout.tsx         # root layout (no Win98 chrome)
│   ├── page.tsx           # mounts <WillBBTerminal /> fullscreen
│   └── globals.css        # tailwind + willbb-livepulse keyframes
│
├── components/apps/willbb/
│   ├── OpenBB.tsx         # top-level: tabs (Markets/Equity/Discovery/Research) + ticker strip
│   ├── BootScreen.tsx     # Bloomberg-style cold-boot animation
│   ├── EquityResearch.tsx # 14-sub-tab equity research panel
│   ├── EquityAlphaViews.tsx # News+S, Smart Money, Transcript (AV-powered)
│   ├── Discovery.tsx      # Screeners + Macro + Calendars tabs
│   ├── MacroPanel.tsx     # yield curve hero + 7 macro sparklines
│   ├── CalendarsPanel.tsx # earnings + IPO
│   ├── PriceChart.tsx     # legacy small line chart
│   ├── TechnicalsView.tsx # TradingView embedded widget config
│   ├── TradingViewChart.tsx
│   ├── SymbolSearch.tsx   # AV-powered autocomplete
│   ├── SourceBadge.tsx    # LIVE/DELAYED/EOD/CACHED/SYNTHETIC pill
│   ├── symbols.ts         # INDEX_STRIP + WATCHLIST_ORDER
│   └── quantdesk/
│       ├── QuantDesk.tsx        # 4-sub-tab Research panel
│       ├── Cockpit.tsx          # Studies pane
│       ├── Scanner.tsx          # Cross-Section pane
│       ├── StrategyLab.tsx      # Alpha Lab pane (DSL editor)
│       ├── RiskDashboard.tsx    # PnL Attribution pane
│       ├── QuantChart.tsx       # hand-rolled SVG candlestick chart
│       ├── PaperBlotter.tsx     # paper-trade ledger
│       ├── indicators.ts        # 18 quant primitives
│       ├── backtest.ts          # backtest engine + walk-forward CV
│       ├── factorRegression.ts  # OLS + Carhart 4-factor
│       └── presets.ts           # 6 built-in DSL strategies
│
├── lib/
│   ├── alphavantage.ts    # 17 AV endpoint fetchers + budget guard
│   ├── stooq.ts           # CSV historical + last-quote
│   ├── useLiveQuote.ts    # 5s polling hook
│   ├── marketsFallback.ts # SEED_QUOTES dictionary
│   ├── equityFallback.ts  # equity research seed data
│   ├── equityModuleFallback.ts
│   └── wm/types.ts        # minimal WindowState stub
│
└── data/
    └── trades.ts          # 267 paper-trade records (for the Paper Blotter)
```

---

## Bundle size

- **First Load JS: 160 KB** — comparable to a static landing page
- All AV/Stooq/Yahoo retry logic is server-side only (zero client-side AV)
- Hand-rolled SVG candlestick chart instead of `lightweight-charts` (would have added ~50 KB)
- No state management library beyond React hooks (no Redux/Zustand)

---

## License

MIT. Use this code freely.

The Paper Blotter records in `data/trades.ts` are real personal trade history — the data isn't licensed for redistribution but the schema/format is. Replace with your own.

---

## Credits

Designed + engineered by **[Will Zhang](https://www.linkedin.com/in/willzhang6200)** as part of the [WillOS 98 Portfolio](https://github.com/w1zz7/willos-98-portfolio).

Data: Yahoo Finance v8, [CoinGecko](https://www.coingecko.com/), [Alpha Vantage](https://www.alphavantage.co/), [Stooq](https://stooq.com/), TradingView (Markets-tab embed).

Built with Next.js 15, React 19, TypeScript 5, Tailwind CSS 4.
