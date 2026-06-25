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

const RAIL_W = 62;

function PercentileRail({ data, color }: { data: TierData; color: string }) {
  // Order high→low and nudge apart so clustered labels don't collide.
  const rows = [
    { tag: "P75", v: data.p75 },
    { tag: "P50", v: data.p50 },
    { tag: "P25", v: data.p25 },
  ].map((r) => ({ ...r, top: 100 - pos(r.v) }));
  const MIN_GAP = 12; // percent of plot height
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].top - rows[i - 1].top < MIN_GAP) {
      rows[i].top = rows[i - 1].top + MIN_GAP;
    }
  }
  return (
    <div style={{ position: "relative", width: RAIL_W, flexShrink: 0 }}>
      {rows.map((r) => (
        <div
          key={r.tag}
          style={{
            position: "absolute",
            top: `${r.top}%`,
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            lineHeight: 1.1,
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 9.5,
              letterSpacing: "0.10em",
              color: "var(--text-tertiary)",
            }}
          >
            {r.tag}
          </span>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
              color,
            }}
          >
            {formatDollars(r.v)}
          </span>
        </div>
      ))}
    </div>
  );
}

function TierColumn({
  data,
  color,
  band,
  label,
}: {
  data: TierData;
  color: string;
  band: string;
  label: string;
}) {
  const has = data.n > 0;
  return (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ flex: 1, minHeight: 0, display: "flex", gap: 6 }}>
        {/* Plot strip */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
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
              {/* P25 / P75 dashed lines */}
              {[data.p25, data.p75].map((v) => (
                <div
                  key={v}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: `${pos(v)}%`,
                    borderTop: `1px dashed ${color}`,
                    opacity: 0.7,
                  }}
                />
              ))}
              {/* P50 solid median line */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: `${pos(data.p50)}%`,
                  height: 2,
                  background: color,
                }}
              />
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
            </>
          )}
        </div>
        <PercentileRail data={data} color={color} />
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
          color: "var(--text-tertiary)",
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
                  color: "var(--text-tertiary)",
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
        />
        <TierColumn
          data={scatter.highCon}
          color="var(--champagne)"
          band="var(--scatter-champagne-band)"
          label="High Consequence"
        />
      </div>
    </section>
  );
}
