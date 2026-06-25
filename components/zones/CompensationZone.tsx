"use client";

import { useFilters } from "@/app/benchmark/FilterContext";
import { useZoneFade } from "@/app/benchmark/useZoneFade";
import { formatDollars, formatPercent } from "@/lib/metrics";

// Distribution-bar scale (fixed floor/ceiling, $150K–$2.2M).
const FLOOR_$ = 150000;
const CEIL_$ = 2200000;
const pos = (v: number) =>
  Math.max(0, Math.min(100, ((v - FLOOR_$) / (CEIL_$ - FLOOR_$)) * 100));

/** Whole-thousands integer for the $XXX<sup>K</sup> display. */
const k = (v: number) => Math.round(v / 1000).toString();

const endcapStyle: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 12,
  color: "var(--text-tertiary)",
};

function StatBlock({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: number;
  sublabel: string;
  accent: boolean;
}) {
  return (
    <div className="stat-block">
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          color: "var(--text-tertiary)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400,
          fontSize: 30,
          lineHeight: 1,
          color: "var(--text-primary)",
        }}
      >
        ${k(value)}
        <sup style={{ fontSize: 16, opacity: 0.7 }}>K</sup>
      </span>
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10.5,
          color: "var(--text-tertiary)",
        }}
      >
        {sublabel}
      </span>
    </div>
  );
}

export default function CompensationZone() {
  const { metrics, filterState } = useFilters();
  const fade = useZoneFade(filterState);
  const c = metrics.comp;

  const stats = [
    { label: "Base", value: c.baseMean, sublabel: "average", accent: false },
    {
      label: "Bonus",
      value: c.bonusMean,
      sublabel: `${formatPercent(c.bonusNullRate)} report none`,
      accent: false,
    },
    {
      label: "Equity",
      value: c.equityMean,
      sublabel: `${formatPercent(c.equityNullRate)} report none`,
      accent: false,
    },
    {
      label: "Total Comp",
      value: c.totalCompAvg,
      sublabel: "average",
      accent: true,
    },
  ];

  const markers = [
    { tag: "P25", value: formatDollars(c.tcP25), left: pos(c.tcP25), highlight: false },
    { tag: "P50", value: formatDollars(c.tcP50), left: pos(c.tcP50), highlight: true },
    { tag: "P75", value: formatDollars(c.tcP75), left: pos(c.tcP75), highlight: false },
  ];

  return (
    <section
      className="comp-zone"
      style={{
        padding: "20px 26px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        ...fade,
      }}
    >
      {/* Zone header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
          Compensation
        </span>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            color: "var(--text-tertiary)",
          }}
        >
          <span style={{ color: "var(--text-secondary)" }}>Total Comp</span> | Base |
          Equity
        </span>
      </div>

      {/* Stat blocks */}
      <div className="comp-stats">
        {stats.map((stat) => (
          <StatBlock key={stat.label} {...stat} />
        ))}
      </div>

      {/* Distribution — grows to fill the zone and vertically centres so the
          bar never strands a void above Governance. */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 22,
        }}
      >
        {/* Total-comp range bar with percentile ticks */}
        <div>
          {/* Ticks sit directly on the track at their true positions */}
          <div style={{ position: "relative", height: 14 }}>
            {markers.map((m) => (
              <span
                key={m.tag}
                style={{
                  position: "absolute",
                  left: `${m.left}%`,
                  transform: "translateX(-50%)",
                  bottom: 0,
                  width: m.highlight ? 2 : 1.5,
                  height: 14,
                  background: m.highlight
                    ? "var(--data-cobalt)"
                    : "var(--champagne)",
                }}
              />
            ))}
          </div>

          {/* Track */}
          <div
            style={{
              height: 14,
              background: "var(--bar-bg)",
              borderRadius: 7,
              backgroundImage:
                "linear-gradient(90deg, transparent 0%, var(--bar-bg) 8%, var(--champagne-mid) 35%, var(--champagne) 48%, var(--champagne) 52%, var(--champagne-mid) 65%, var(--bar-bg) 92%, transparent 100%)",
              opacity: 0.85,
            }}
          />

          {/* Floor / ceiling endcaps */}
          <div
            style={{
              marginTop: 8,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={endcapStyle}>$150K</span>
            <span style={endcapStyle}>$2.2M+</span>
          </div>
        </div>

        {/* Percentile readout — evenly spaced beneath the bar so the dollar
            figures can never overlap regardless of how the markers cluster. */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            alignItems: "end",
          }}
        >
          {markers.map((m, i) => (
            <div
              key={m.tag}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
                textAlign: i === 0 ? "left" : i === 2 ? "right" : "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  color: m.highlight
                    ? "var(--data-cobalt)"
                    : "var(--text-tertiary)",
                }}
              >
                {m.tag}
              </span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400,
                  fontSize: 28,
                  lineHeight: 1,
                  color: m.highlight
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                }}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
