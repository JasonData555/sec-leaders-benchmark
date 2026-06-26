"use client";

import { useFilters } from "@/app/benchmark/FilterContext";
import { useZoneFade } from "@/app/benchmark/useZoneFade";
import { formatDollars, type TierScatter as TierData } from "@/lib/metrics";

// Shared Y-axis scale (fixed floor/ceiling, $150K–$2.2M) — matches the
// retired distribution bar so figures stay comparable across filters.
const FLOOR_$ = 150000;
const CEIL_$ = 2200000;
const pos = (v: number) =>
  Math.max(0, Math.min(100, ((v - FLOOR_$) / (CEIL_$ - FLOOR_$)) * 100));

// Y-axis gridline labels at their true scale positions.
const AXIS_TICKS: { v: number; label: string }[] = [
  { v: 150000, label: "$150K" },
  { v: 750000, label: "$750K" },
  { v: 1500000, label: "$1.5M" },
  { v: 2200000, label: "$2.2M+" },
];

// Deterministic horizontal jitter for a given index — keeps dots stable across
// re-renders (no Math.random reshuffle). Returns a fraction 0..1.
function jitter(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

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
}: {
  data: TierData;
  color: string;
  band: string;
  label: string;
  align: "left" | "right";
}) {
  const has = data.n > 0;

  // Label rows: place each at its true position (top%), then nudge apart so the
  // two-line labels don't collide, clamping within the strip top/bottom.
  const MIN_GAP = 14; // percent of plot height between adjacent labels
  const PAD = 5; // keep labels off the very top/bottom edge
  const rows = PCTS.map((p) => ({
    ...p,
    v: data[p.key] as number,
    top: 100 - pos(data[p.key] as number),
  }));
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].top - rows[i - 1].top < MIN_GAP) {
      rows[i].top = rows[i - 1].top + MIN_GAP;
    }
  }
  const overflow = rows[rows.length - 1].top - (100 - PAD);
  if (overflow > 0) rows.forEach((r) => (r.top -= overflow));
  if (rows[0].top < PAD) {
    const under = PAD - rows[0].top;
    rows.forEach((r) => (r.top += under));
  }

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
                }}
              />
            ))}
            {/* Percentile labels — interior of the column, hugging one edge */}
            {rows.map((r) => (
              <div
                key={r.key as string}
                style={{
                  position: "absolute",
                  top: `${r.top}%`,
                  transform: "translateY(-50%)",
                  [align === "right" ? "left" : "right"]: 8,
                  width: 94,
                  textAlign: align,
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: 1.1,
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 8.5,
                    letterSpacing: "0.06em",
                    color: "var(--text-tertiary)",
                  }}
                >
                  {r.name}
                </span>
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 11,
                    fontWeight: r.bold ? 500 : 400,
                    color,
                  }}
                >
                  {formatDollars(r.v)}
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

export default function TierScatter() {
  const { scatter, filterState } = useFilters();
  const fade = useZoneFade(filterState);

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
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
        }}
      >
        Total Comp Distribution
      </span>

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
            {AXIS_TICKS.map((t) => (
              <span
                key={t.v}
                style={{
                  position: "absolute",
                  bottom: `${pos(t.v)}%`,
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
          data={scatter.baseline}
          color="var(--scatter-slate)"
          band="var(--scatter-slate-band)"
          label="Baseline Risk"
          align="right"
        />
        <TierColumn
          data={scatter.highCon}
          color="var(--champagne)"
          band="var(--scatter-champagne-band)"
          label="High Consequence"
          align="left"
        />
      </div>
    </section>
  );
}
