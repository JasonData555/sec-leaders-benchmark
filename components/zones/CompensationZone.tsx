"use client";

import { useFilters } from "@/app/benchmark/FilterContext";
import { useZoneFade } from "@/app/benchmark/useZoneFade";

/** Whole-thousands integer for the $XXX<sup>K</sup> display. */
const k = (v: number) => Math.round(v / 1000).toString();

const microLabel: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 11,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "var(--text-tertiary)",
};

function StatBlock({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: number;
  sublabel?: string;
}) {
  return (
    <div className="stat-block">
      <span style={microLabel}>{label}</span>
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
      {sublabel && (
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10.5,
            color: "var(--text-tertiary)",
          }}
        >
          {sublabel}
        </span>
      )}
    </div>
  );
}

export default function CompensationZone() {
  const { metrics, filterState } = useFilters();
  const fade = useZoneFade(filterState);
  const c = metrics.comp;

  const breakdown = [
    { label: "Base", value: c.baseMean, sublabel: "average" },
    { label: "Bonus", value: c.bonusMean },
    { label: "Equity", value: c.equityMean },
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
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
        }}
      >
        Compensation
      </span>

      {/* Hero Total Comp + component breakdown */}
      <div className="comp-row">
        <div className="comp-hero">
          <span style={microLabel}>Average Total Comp</span>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400,
              fontSize: 52,
              lineHeight: 1,
              color: "var(--champagne)",
            }}
          >
            ${k(c.totalCompAvg)}
            <sup style={{ fontSize: 26, opacity: 0.7 }}>K</sup>
          </span>
        </div>

        <div className="comp-stats">
          {breakdown.map((stat) => (
            <StatBlock key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
