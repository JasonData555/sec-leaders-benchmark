"use client";

import { useEffect, useMemo, useState } from "react";
import { useFilters } from "@/app/benchmark/FilterContext";
import { useZoneFade } from "@/app/benchmark/useZoneFade";
import {
  formatDollars,
  type CompView,
  type TierScatter as TierData,
} from "@/lib/metrics";

// ── Y-axis scale ────────────────────────────────────────────────────────────
// The Total view keeps the original fixed floor/ceiling ($150K–$2.2M) and tick
// labels verbatim so the default distribution is pixel-identical to before.
// Cash / Base derive a padded scale from their own data.
const clamp = (x: number) => Math.max(0, Math.min(100, x));

interface Scale {
  pos: (v: number) => number;
  ticks: { v: number; label: string }[];
  /** Displayed-label overrides for the High Consequence column (Total only). */
  hcOverrides?: Partial<Record<keyof TierData, string>>;
}

function fmtAxis(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(v / 1000)}K`;
}

const TOTAL_SCALE: Scale = {
  pos: (v) => clamp(((v - 150000) / (2200000 - 150000)) * 100),
  ticks: [
    { v: 150000, label: "$150K" },
    { v: 750000, label: "$750K" },
    { v: 1500000, label: "$1.5M" },
    { v: 2200000, label: "$2.2M+" },
  ],
  hcOverrides: { p90: "$1522K" },
};

function makeScale(view: CompView, baseline: TierData, highCon: TierData): Scale {
  if (view === "total") return TOTAL_SCALE;

  const all = [...baseline.points, ...highCon.points];
  if (!all.length) return TOTAL_SCALE;

  const min = Math.min(...all);
  const max = Math.max(...all);
  const range = max - min || max || 1;
  const pad = range * 0.05;
  const floor = Math.max(0, min - pad);
  const ceil = max + pad;
  const span = ceil - floor || 1;

  return {
    pos: (v) => clamp(((v - floor) / span) * 100),
    ticks: [0, 1, 2, 3].map((i) => {
      const v = floor + span * (i / 3);
      return { v, label: fmtAxis(v) };
    }),
  };
}

const VIEW_LABEL: Record<CompView, string> = {
  total: "Total Comp Distribution",
  cash: "Cash Comp Distribution",
  base: "Base Distribution",
};

const SEGMENTS: { value: CompView; label: string }[] = [
  { value: "total", label: "Total Comp" },
  { value: "cash", label: "Cash Comp" },
  { value: "base", label: "Base Only" },
];

// Deterministic horizontal jitter for a given index — keeps dots stable across
// re-renders (no Math.random reshuffle). Returns a fraction 0..1.
function jitter(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// Uniform typographic nudge (px) keeping label text off its line — applied
// identically to every label so it never accumulates across the stack.
const LABEL_NUDGE = 4;

// Percentile line + label definitions (high→low). `dash` empty = solid.
type PctSpec = {
  key: keyof TierData;
  name: string;
  dash: string;
  width: number;
  opacity: number;
  bold?: boolean;
};
const PCTS: PctSpec[] = [
  { key: "p90", name: "90th Percentile", dash: "2 4", width: 1, opacity: 0.48 },
  { key: "p75", name: "75th Percentile", dash: "4 3", width: 1, opacity: 0.55 },
  { key: "p50", name: "Median", dash: "", width: 2, opacity: 0.88, bold: true },
  { key: "p25", name: "25th Percentile", dash: "4 3", width: 1, opacity: 0.55 },
  { key: "p10", name: "10th Percentile", dash: "2 4", width: 1, opacity: 0.48 },
];

function TierColumn({
  data,
  color,
  band,
  label,
  align,
  pos,
  labelOverrides,
  animate,
}: {
  data: TierData;
  color: string;
  band: string;
  label: string;
  align: "left" | "right";
  pos: (v: number) => number;
  labelOverrides?: Partial<Record<keyof TierData, string>>;
  animate: boolean;
}) {
  const has = data.n > 0;
  const move = animate ? "bottom 250ms ease, height 250ms ease" : undefined;
  const moveTop = animate ? "top 250ms ease" : undefined;

  // Label rows: each label's vertical anchor is derived from the identical pos()
  // call used to draw its line (:180), so labels track the data, never drift.
  const rows = PCTS.map((p) => ({
    ...p,
    v: data[p.key] as number,
    top: 100 - pos(data[p.key] as number), // identical expression to the line
  }));

  return (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Plot strip */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: "relative",
          background: "var(--bar-bg)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {has && (
          <>
            {/* P25–P75 band */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: `${pos(data.p25)}%`,
                height: `${pos(data.p75) - pos(data.p25)}%`,
                background: band,
                transition: move,
              }}
            />
            {/* Percentile lines (P10/P25/P50/P75/P90) */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ position: "absolute", inset: 0 }}
            >
              {PCTS.map((p) => {
                const y = 100 - pos(data[p.key] as number);
                return (
                  <line
                    key={p.key as string}
                    x1={0}
                    y1={y}
                    x2={100}
                    y2={y}
                    stroke={color}
                    strokeWidth={p.width}
                    strokeOpacity={p.opacity}
                    strokeDasharray={p.dash || undefined}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
            </svg>
            {/* Jittered dots */}
            {data.points.map((v, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: `${15 + jitter(i) * 70}%`,
                  bottom: `${pos(v)}%`,
                  width: 5,
                  height: 5,
                  marginLeft: -2.5,
                  marginBottom: -2.5,
                  borderRadius: "50%",
                  background: color,
                  opacity: 0.32,
                  transition: move,
                }}
              />
            ))}
            {/* Percentile labels — interior of the column, hugging one edge */}
            {rows.map((r) => (
              <div
                key={r.key as string}
                style={{
                  position: "absolute",
                  top: `calc(${r.top}% + ${LABEL_NUDGE}px)`,
                  transform: "translateY(-50%)",
                  [align === "right" ? "left" : "right"]: 8,
                  width: 94,
                  textAlign: align,
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: 1.1,
                  pointerEvents: "none",
                  transition: moveTop,
                }}
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 9,
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    color: "var(--scatter-axis)",
                  }}
                >
                  {r.name}
                </span>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 12.5,
                    fontWeight: r.bold ? 600 : 500,
                    color,
                  }}
                >
                  {labelOverrides?.[r.key] ?? formatDollars(r.v)}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
      {/* Column header */}
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10.5,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
        }}
      >
        {label} · n = {data.n}
      </span>
    </div>
  );
}

export default function TierScatter({ showToggle = true }: { showToggle?: boolean }) {
  const { scatter, filterState } = useFilters();
  const fade = useZoneFade(filterState);

  const [view, setView] = useState<CompView>("total");
  const compView: CompView = showToggle ? view : "total";

  // Enable position transitions only after first paint so the initial (Total)
  // render — and the static PDF export snapshot — never animate.
  const [animate, setAnimate] = useState(false);
  useEffect(() => setAnimate(true), []);

  const baseline = scatter.baseline[compView];
  const highCon = scatter.highCon[compView];
  const scale = useMemo(
    () => makeScale(compView, baseline, highCon),
    [compView, baseline, highCon]
  );

  const excluded = baseline.excluded + highCon.excluded;

  return (
    <section
      className="scatter-zone"
      style={{
        padding: "20px 26px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        ...fade,
      }}
    >
      {/* Header: section label + view toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
          }}
        >
          {VIEW_LABEL[compView]}
        </span>

        {showToggle && (
          <div
            style={{
              display: "flex",
              background: "var(--chip-bg)",
              border: "1px solid var(--border)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {SEGMENTS.map((seg, i) => {
              const active = seg.value === compView;
              return (
                <button
                  key={seg.value}
                  type="button"
                  onClick={() => setView(seg.value)}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                    fontSize: 11,
                    lineHeight: 1.3,
                    padding: "6px 11px",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    border: "none",
                    borderLeft: i === 0 ? "none" : "1px solid var(--border)",
                    background: active ? "var(--data-cobalt-mid)" : "transparent",
                    color: active ? "var(--data-cobalt)" : "var(--text-secondary)",
                    transition: "background 120ms ease, color 120ms ease",
                  }}
                >
                  {seg.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 0, display: "flex", gap: 14 }}>
        {/* Shared Y-axis — mirrors the column layout (plot area + header-height
            spacer) so axis ticks align with the plot strips, not the headers. */}
        <div
          style={{
            width: 46,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
            {scale.ticks.map((t) => (
              <span
                key={t.v}
                style={{
                  position: "absolute",
                  bottom: `${scale.pos(t.v)}%`,
                  right: 0,
                  transform: "translateY(50%)",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  color: "var(--scatter-axis)",
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
              </span>
            ))}
          </div>
          {/* spacer matching the column-header row height */}
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, visibility: "hidden" }}>
            n
          </span>
        </div>

        {/* Two tier columns */}
        <TierColumn
          data={baseline}
          color="var(--scatter-slate)"
          band="var(--scatter-slate-band)"
          label="Baseline Risk"
          align="right"
          pos={scale.pos}
          animate={animate}
        />
        <TierColumn
          data={highCon}
          color="var(--champagne)"
          band="var(--scatter-champagne-band)"
          label="High Consequence"
          align="left"
          pos={scale.pos}
          labelOverrides={scale.hcOverrides}
          animate={animate}
        />
      </div>

      {/* Cash-view methodology footnote */}
      {compView === "cash" && (
        <span
          style={{
            flex: "none",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9,
            color: "var(--scatter-slate)",
            opacity: 0.6,
          }}
        >
          Percentiles exclude profiles without a reported bonus (n = {excluded}).
        </span>
      )}
    </section>
  );
}
