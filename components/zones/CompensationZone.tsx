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

function StatBlock({
  label,
  value,
  sublabel,
  withDivider,
}: {
  label: string;
  value: number;
  sublabel: string;
  accent: boolean;
  withDivider: boolean;
}) {
  return (
    <div
      style={{
        flex: 1,
        paddingLeft: withDivider ? 20 : 0,
        marginLeft: withDivider ? 20 : 0,
        borderLeft: withDivider ? "1px solid var(--border)" : "none",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
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
    { label: `P25 · ${formatDollars(c.tcP25)}`, left: pos(c.tcP25), highlight: false },
    { label: `P50 · ${formatDollars(c.tcP50)}`, left: pos(c.tcP50), highlight: true },
    { label: `P75 · ${formatDollars(c.tcP75)}`, left: pos(c.tcP75), highlight: false },
  ];

  return (
    <section
      style={{
        flex: 1.6,
        minHeight: 0,
        overflow: "hidden",
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
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {stats.map((stat, i) => (
          <StatBlock key={stat.label} {...stat} withDivider={i > 0} />
        ))}
      </div>

      {/* Distribution bar */}
      <div style={{ marginTop: 8, position: "relative", paddingTop: 22 }}>
        {markers.map((m) => (
          <div
            key={m.label}
            style={{ position: "absolute", left: `${m.left}%`, top: 0 }}
          >
            <span
              style={{
                position: "absolute",
                top: 0,
                transform: "translateX(-50%)",
                whiteSpace: "nowrap",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 14,
                fontWeight: m.highlight ? 400 : 300,
                color: "var(--text-primary)",
              }}
            >
              {m.label}
            </span>
            <span
              style={{
                position: "absolute",
                top: 16,
                width: m.highlight ? 2 : 1.5,
                height: 17,
                background: m.highlight ? "var(--data-cobalt)" : "var(--champagne)",
              }}
            />
          </div>
        ))}

        {/* Track */}
        <div
          style={{
            height: 5,
            background: "var(--bar-bg)",
            borderRadius: 3,
            backgroundImage:
              "linear-gradient(90deg, transparent 0%, var(--bar-bg) 8%, var(--champagne-mid) 35%, var(--champagne) 48%, var(--champagne) 52%, var(--champagne-mid) 65%, var(--bar-bg) 92%, transparent 100%)",
            opacity: 0.8,
          }}
        />

        {/* Floor / ceiling labels */}
        <div
          style={{ marginTop: 6, display: "flex", justifyContent: "space-between" }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10.5,
              color: "var(--text-tertiary)",
            }}
          >
            $150K
          </span>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10.5,
              color: "var(--text-tertiary)",
            }}
          >
            $2.2M+
          </span>
        </div>
      </div>
    </section>
  );
}
