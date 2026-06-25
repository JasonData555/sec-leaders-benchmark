"use client";

import { useFilters } from "@/app/benchmark/FilterContext";
import { useZoneFade } from "@/app/benchmark/useZoneFade";
import { formatPercent } from "@/lib/metrics";

/** Whole-thousands integer for the $XXX<sup>K</sup> display. */
const k = (v: number) => Math.round(v / 1000).toString();

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

  return (
    <section
      className="comp-zone"
      style={{
        padding: "20px 26px 18px",
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
    </section>
  );
}
