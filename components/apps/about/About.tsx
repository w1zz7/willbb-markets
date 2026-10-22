"use client";

import { useState, useEffect, createContext, useContext } from "react";
import type { WindowState } from "@/lib/wm/types";
import { openApp } from "@/lib/wm/registry";

/* --------------------------------------------------------------
   Lightbox context - any media thumbnail inside the About window can
   call openLightbox({ src, title, caption }) to raise a full-size
   modal. Currently unused by the live surface after the Experience
   section was removed; kept so new sections can tap it without
   re-plumbing the provider.
   -------------------------------------------------------------- */
interface LightboxData {
  src: string;
  title?: string;
  caption?: string;
}
const LightboxContext = createContext<{
  open: (d: LightboxData) => void;
} | null>(null);

function useLightbox() {
  return useContext(LightboxContext);
}


/* --------------------------------------------------------------
   Skills - rendered as a real Excel grid (column letters, row
   numbers, selectable cells, formula bar). Mirrors the Skills sheet
   in WillZhang.xlsx so every category from the workbook is visible
   on the About page without opening Excel.
   -------------------------------------------------------------- */
interface SkillRow {
  category: string;
  stack: string;
}

// Rows 2-8 in the image: hard skills
const HARD_SKILL_ROWS: SkillRow[] = [
  {
    category: "Modeling & Finance",
    stack:
      "DCF · 3-Statement · FMVA® · UPenn Quant Modeling · multifamily underwriting (Project Destined)",
  },
  {
    category: "Data & Analytics",
    stack:
      "Python · SQL · Tableau · Power BI · Excel (Yellow Belt) · Google Sheets",
  },
  {
    category: "AI & ML",
    stack:
      "Claude Code · AI SubAgents · Prompt Engineering (few-shot, constraint-setting) · AI Prompting · AI Management · AI Equity Research · Retrieval-Augmented Generation (RAG) · ATS model training (200k resumes) · OpenAI + ElevenLabs agents",
  },
  {
    category: "Engineering",
    stack:
      "HTML · CSS · JavaScript · TypeScript · Next.js · React 18 · Vite · Node.js + Express + Prisma · Supabase · Framer Motion · Raspberry Pi 4 (PhilAIsion kiosk) · Google Cloud Platform · Web Hosting · Terminal Server",
  },
  {
    category: "Sales & Growth",
    stack:
      "Booth-based sales (Vovex $20k+, 60% engagement lift) · SMB consulting (Local Launch, 10 sites, 300%+ SEO lift) · Meta Social Media Marketing · Google Ads",
  },
  {
    category: "Design & Ops",
    stack: "Figma · Canva · Microsoft Office · Google Workspace",
  },
  {
    category: "Languages",
    stack: "English (native) · Mandarin Chinese (Seal of Biliteracy)",
  },
];

// Soft skills - appear below hard skills under a merged "Soft Skills" header
const SOFT_SKILL_ROWS: SkillRow[] = [
  {
    category: "Leadership",
    stack: "7-person distributed team across UVA, UMD, Purdue, MIT",
  },
  {
    category: "Public Speaking",
    stack: "11 events · 1,400+ students reached · 7 live competition pitches",
  },
  {
    category: "Operations",
    stack: "Cross-continental coordination (US / China / PA)",
  },
  {
    category: "Writing",
    stack: "Journal every trading day · 65+ market entries logged",
  },
  {
    category: "Judgment",
    stack: "Junior-golf background - shotmaking under pressure",
  },
  {
    category: "Communication",
    stack: "Honest - flag limits + ask for feedback fast",
  },
];

export default function About({ window: _ }: { window: WindowState }) {
  const [lightbox, setLightbox] = useState<LightboxData | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <LightboxContext.Provider value={{ open: (d) => setLightbox(d) }}>
    <div className="relative h-full w-full flex flex-col overflow-hidden">
    <div className="flex-1 min-h-0 flex flex-col bg-[color:var(--color-win-bg)] overflow-auto win-scroll">
      {/* Hero with banner backdrop */}
      <div
        className="relative border-b border-[#808080]"
        style={{
          backgroundImage: "url(/linkedin/banner.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="flex gap-[16px] p-[16px] items-end"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.55) 100%)",
            minHeight: 180,
          }}
        >
          <div
            className="w-[120px] h-[120px] shrink-0 flex items-center justify-center overflow-hidden"
            style={{
              background: "#fff",
              border: "3px solid #fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            <img
              src="/will-zhang.jpg"
              alt="Will Zhang"
              width={120}
              height={120}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <div className="flex-1 min-w-0 text-white">
            <div className="text-[24px] font-bold leading-tight drop-shadow">
              Will Zhang
            </div>
            <div className="text-[20px] mt-[2px] drop-shadow opacity-95">
              Philadelphia, PA
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats - GPA, school, status */}
      <div className="p-[16px] border-b border-[#808080] bg-white">
        <div
          className="grid gap-[8px]"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          }}
        >
          <Stat label="GPA" value="4.0 / 4.0" hint="Dean's List · Dec 2025 – Present" />
          <Stat label="School" value="Drexel LeBow" hint="B.S. Business Admin · Finance + MIS" />
          <Stat label="Grad" value="June 2029" hint="Fall / Winter co-op track" />
          <Stat label="Location" value="Philadelphia, PA" hint="+ SoCal / China travel" />
        </div>
      </div>

      {/* About (Will's own words) */}
      <div className="p-[16px] border-b border-[#808080]">
        <div className="font-bold text-[18px] mb-[6px]">About</div>
        <p className="text-[20px] leading-relaxed italic text-[#333] mb-[6px]">
          &quot;Work with heart, and let&apos;s build a strong, supportive community
          where people can help each other thrive.&quot;
        </p>
        <p className="text-[20px] leading-relaxed italic text-[#333] mb-[6px]">
          &quot;Courage is not the absence of fear, but the will to move forward
          despite it.&quot;
        </p>
        <p className="text-[20px] leading-relaxed italic text-[#333]">
          Dream big, learn fast.
        </p>
      </div>

      {/* Skills - rendered as a live Excel grid */}
      <div className="p-[16px] border-b border-[#808080]">
        <div className="flex items-baseline justify-between gap-[8px] mb-[6px]">
          <div className="font-bold text-[18px]">Skills</div>
          <div className="text-[15px] italic text-[color:var(--color-win-text-disabled)]">
            Skills.xlsx · click any cell →{" "}
            <button
              type="button"
              onClick={() => openApp("excel", { initialSheet: "skills" })}
              className="underline text-[#0000ee] bg-transparent"
            >
              open full workbook
            </button>
          </div>
        </div>
        <SkillsExcel />
      </div>

      {/* Golf chapter - "where I came from" context, sits above the work
          history so the personal arc leads directly into the resume. */}
      <div className="p-[16px] border-b border-[#808080]">
        <div className="font-bold text-[18px] mb-[6px]">Before all of this</div>
        <p className="text-[20px] leading-relaxed mb-[6px]">
          I grew up as a competitive junior golfer:{" "}
          <b>3× 2nd and 2× 3rd</b> on the PGA Southern California Junior Tour,{" "}
          <b>2× 2nd</b> on the Philadelphia Section PGA Junior Tour,{" "}
          <b>1× 2nd</b> on the TYGA (Tarheel Youth Golf Association, NC), and{" "}
          <b>2× podium</b> in China national junior tournaments.
        </p>
        <p className="text-[20px] leading-relaxed mb-[6px]">
          I had to stop competing after a lower-back injury and a slipped-disc
          diagnosis. The torque of a competitive swing made it impossible to
          keep playing at that level.
        </p>
        <p className="text-[20px] leading-relaxed italic text-[#555]">
          I still think about approach shots when I&apos;m solving problems. Super
          Lychee Golf Series (ops) and the CNIPA Multi-Purpose Golf Bag patent
          both grew out of this chapter.{" "}
          <button
            type="button"
            className="underline text-[#0000ee] bg-transparent"
            onClick={() => openApp("golf-memories")}
          >
            Open Golf Memories →
          </button>
        </p>
      </div>

      {/* CTAs */}
      <div className="p-[16px] border-t border-[#808080] flex gap-[6px] flex-wrap">
        <button
          type="button"
          className="win-btn"
          onClick={() => openApp("excel")}
        >
          Open WillZhang.xlsx
        </button>
        <button
          type="button"
          className="win-btn"
          onClick={() => openApp("projects")}
        >
          Projects
        </button>
        <button
          type="button"
          className="win-btn"
          onClick={() => openApp("speaking")}
        >
          Public Speaking
        </button>
        <button
          type="button"
          className="win-btn"
          onClick={() => openApp("contact")}
        >
          Contact Me
        </button>
      </div>
    </div>

    {/* Lightbox overlay - lives OUTSIDE the scrollable content so it pins
        to the window viewport regardless of scroll position. Click outside
        / × / Esc to close. */}
    {lightbox && (
      <div
        className="absolute inset-0 z-50 flex items-stretch justify-center p-[16px]"
        style={{ background: "rgba(0,0,0,0.78)" }}
        onClick={() => setLightbox(null)}
        role="dialog"
        aria-label={lightbox.title}
      >
        {/* Inner column that respects parent flex bounds so the image never
            overflows the About window viewport. */}
        <div
          className="win-window bg-white p-[4px] flex flex-col gap-[6px]"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            minHeight: 0,
          }}
        >
          <div
            className="win-sunken flex items-center justify-center flex-1 min-h-0"
            style={{ background: "#000" }}
          >
            <img
              src={lightbox.src}
              alt={lightbox.title ?? ""}
              style={{
                display: "block",
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>
          <div className="px-[8px] pb-[4px] flex items-center gap-[10px] text-[17px] shrink-0">
            <div className="flex-1 min-w-0">
              {lightbox.title && (
                <div className="font-bold text-[17px] leading-tight truncate">
                  {lightbox.title}
                </div>
              )}
              {lightbox.caption && (
                <div className="text-[15px] text-[color:var(--color-win-text-disabled)] leading-snug line-clamp-2">
                  {lightbox.caption}
                </div>
              )}
            </div>
            <button
              type="button"
              className="win-btn shrink-0"
              onClick={() => setLightbox(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
    </LightboxContext.Provider>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="win-sunken bg-white p-[8px] flex flex-col gap-[1px]">
      <div className="text-[15px] font-bold uppercase tracking-wide text-[color:var(--color-win-text-disabled)]">
        {label}
      </div>
      <div className="font-bold text-[20px] leading-tight">{value}</div>
      {hint && (
        <div className="text-[16px] text-[#555] leading-snug">{hint}</div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------
   SkillsExcel - renders the Skills section as a real Excel grid
   (column letters A/B, row numbers, selectable cells, formula bar).
   Matches WillZhang.xlsx "Skills" sheet 1:1.
   -------------------------------------------------------------- */
type SkillCellMap = Record<string, { value: string; bg?: string; bold?: boolean; italic?: boolean; color?: string; merged?: boolean }>;

function SkillsExcel() {
  // Build the cell map declaratively so the grid mirrors the xlsx sheet.
  const { cells, maxRow } = (() => {
    const c: SkillCellMap = {};
    const H = "#c0c0c0";
    const SUB = "#e8e8e8";

    c.A1 = { value: "Category", bold: true, bg: H };
    c.B1 = { value: "Stack", bold: true, bg: H };

    let r = 2;
    for (const row of HARD_SKILL_ROWS) {
      c[`A${r}`] = { value: row.category, bold: true, bg: SUB };
      c[`B${r}`] = { value: row.stack };
      r++;
    }

    // Blank spacer row
    r++;

    // Soft skills section header (merged across A+B)
    c[`A${r}`] = {
      value: "Soft Skills",
      bold: true,
      bg: H,
      merged: true,
    };
    r++;

    for (const row of SOFT_SKILL_ROWS) {
      c[`A${r}`] = { value: row.category, bold: true, bg: SUB };
      c[`B${r}`] = { value: row.stack };
      r++;
    }

    // Trailing italic note
    r++;
    c[`A${r}`] = {
      value:
        "// Stack philosophy: learn the tool, ship the thing, verify with the data.",
      italic: true,
      color: "#555",
      merged: true,
    };

    return { cells: c, maxRow: r };
  })();

  const [selected, setSelected] = useState<string>("A2");
  const selCol = selected[0] as "A" | "B";
  const selRow = parseInt(selected.slice(1), 10);
  const selCell = cells[selected];
  const formulaDisplay = selCell?.value ?? "";

  return (
    <div
      className="win-window bg-white flex flex-col"
      style={{ padding: 2 }}
    >
      {/* Formula bar - cell ref + fx + value */}
      <div className="flex items-stretch h-[30px] win-raised border-b border-[#808080]">
        <div className="win-field flex items-center justify-between px-[4px] w-[74px] text-[15px] font-[var(--font-cell)] border-r border-[#808080]">
          <span className="truncate">{selected}</span>
          <span
            className="shrink-0 pl-[2px] text-[color:var(--color-win-text-disabled)]"
            style={{ fontSize: 10, lineHeight: 1 }}
            aria-hidden
          >
            ▾
          </span>
        </div>
        <div
          className="win-btn h-[30px] min-w-0 w-[26px] px-0 flex items-center justify-center"
          aria-hidden
        >
          <span style={{ color: "#c00", fontWeight: 700, fontSize: 14 }}>✕</span>
        </div>
        <div
          className="win-btn h-[30px] min-w-0 w-[26px] px-0 flex items-center justify-center"
          aria-hidden
        >
          <span style={{ color: "#087f23", fontWeight: 700, fontSize: 14 }}>✓</span>
        </div>
        <div
          className="win-btn h-[30px] min-w-0 w-[28px] px-0 flex items-center justify-center"
          aria-hidden
        >
          <span
            style={{ fontFamily: "Georgia, serif", fontSize: 13, fontStyle: "italic", fontWeight: 700 }}
          >
            fx
          </span>
        </div>
        <div
          className="win-field flex-1 flex items-center px-[6px] text-[15px] font-[var(--font-cell)] truncate"
          title={formulaDisplay}
        >
          {formulaDisplay}
        </div>
      </div>

      {/* Grid - no inner scroll; the About window handles vertical scroll */}
      <div className="win-scroll">
        <table
          className="excel-grid"
          style={{ width: "100%", tableLayout: "fixed" }}
        >
          <colgroup>
            <col style={{ width: 44 }} />
            <col style={{ width: 220 }} />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th
                className="sticky top-0 left-0 z-20"
                style={{ width: 44, height: 28, minWidth: 44 }}
                aria-hidden
              />
              <th
                className="sticky top-0 z-10"
                style={{ width: 220, minWidth: 220, height: 28 }}
                data-selected={selCol === "A"}
              >
                A
              </th>
              <th
                className="sticky top-0 z-10"
                style={{ height: 28 }}
                data-selected={selCol === "B"}
              >
                B
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxRow }).map((_, rIdx) => {
              const rowNum = rIdx + 1;
              const aRef = `A${rowNum}`;
              const bRef = `B${rowNum}`;
              const aCell = cells[aRef];
              const bCell = cells[bRef];
              const merged = aCell?.merged;

              // Split Stack text on " · " so each sub-skill sits on its own
              // line inside the cell. Excel "Wrap Text" behavior: cell grows
              // vertically, nothing is cut off even in a narrow window.
              const bLines =
                bCell?.value && bCell.value.includes(" · ")
                  ? bCell.value.split(" · ")
                  : bCell?.value != null
                    ? [bCell.value]
                    : [];
              const wrap = bLines.length > 1;

              return (
                <tr key={rowNum}>
                  <th
                    className="sticky left-0 z-10"
                    style={{ width: 44, minWidth: 44, verticalAlign: "top" }}
                    data-selected={selRow === rowNum}
                  >
                    {rowNum}
                  </th>
                  <td
                    data-cell-ref={aRef}
                    data-selected={selected === aRef}
                    onClick={() => setSelected(aRef)}
                    colSpan={merged ? 2 : undefined}
                    style={{
                      background: aCell?.bg,
                      fontWeight: aCell?.bold ? "bold" : undefined,
                      fontStyle: aCell?.italic ? "italic" : undefined,
                      color: aCell?.color,
                      cursor: aCell ? "cell" : "default",
                      verticalAlign: "top",
                      whiteSpace: merged ? "normal" : undefined,
                      lineHeight: merged ? 1.35 : undefined,
                      padding: merged ? "4px 6px" : undefined,
                      height: merged ? "auto" : undefined,
                    }}
                  >
                    {aCell?.value ?? ""}
                  </td>
                  {!merged && (
                    <td
                      data-cell-ref={bRef}
                      data-selected={selected === bRef}
                      onClick={() => setSelected(bRef)}
                      style={{
                        background: bCell?.bg,
                        fontWeight: bCell?.bold ? "bold" : undefined,
                        fontStyle: bCell?.italic ? "italic" : undefined,
                        color: bCell?.color,
                        cursor: bCell ? "cell" : "default",
                        verticalAlign: "top",
                        whiteSpace: wrap ? "normal" : undefined,
                        lineHeight: wrap ? 1.4 : undefined,
                        padding: wrap ? "4px 6px" : undefined,
                        height: wrap ? "auto" : undefined,
                        overflow: wrap ? "visible" : undefined,
                        textOverflow: wrap ? "clip" : undefined,
                      }}
                    >
                      {wrap ? (
                        bLines.map((line, i) => (
                          <div key={i} style={{ padding: "1px 0" }}>
                            {line}
                          </div>
                        ))
                      ) : (
                        bCell?.value ?? ""
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sheet tab strip - "Skills" tab active, visual parity with Excel */}
      <div
        className="flex items-center gap-[2px] px-[4px] py-[2px] border-t border-[#808080]"
        style={{ background: "#c0c0c0" }}
      >
        <div
          className="win-raised px-[8px] py-[2px] text-[14px] font-bold bg-white"
          style={{ borderBottom: "2px solid #fff" }}
        >
          Skills
        </div>
        <button
          type="button"
          onClick={() => openApp("excel")}
          className="px-[8px] py-[2px] text-[14px] bg-[#c0c0c0] hover:bg-[#d0d0d0] cursor-pointer border-0"
          style={{ fontFamily: "var(--font-cell)" }}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => openApp("excel")}
          className="px-[8px] py-[2px] text-[14px] bg-[#c0c0c0] hover:bg-[#d0d0d0] cursor-pointer border-0"
          style={{ fontFamily: "var(--font-cell)" }}
        >
          Experience
        </button>
        <button
          type="button"
          onClick={() => openApp("excel")}
          className="px-[8px] py-[2px] text-[14px] bg-[#c0c0c0] hover:bg-[#d0d0d0] cursor-pointer border-0"
          style={{ fontFamily: "var(--font-cell)" }}
        >
          Projects
        </button>
        <div className="flex-1" />
        <div className="text-[13px] text-[color:var(--color-win-text-disabled)] px-[4px]">
          Ready
        </div>
      </div>
    </div>
  );
}
