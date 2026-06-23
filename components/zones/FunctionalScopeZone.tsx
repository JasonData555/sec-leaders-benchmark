"use client";

import { useFilters } from "@/app/benchmark/FilterContext";
import { useZoneFade } from "@/app/benchmark/useZoneFade";
import { formatPercent } from "@/lib/metrics";

function FunctionBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span
        title={label}
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: 12.5,
          color: "var(--text-secondary)",
          width: 170,
          flexShrink: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </span>
      <span
        style={{
          flex: 1,
          height: 2.5,
          background: "var(--bar-bg)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            display: "block",
            width: `${pct}%`,
            height: "100%",
            background: "var(--champagne)",
          }}
        />
      </span>
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10.5,
          color: "var(--text-tertiary)",
          width: 34,
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {formatPercent(pct)}
      </span>
    </div>
  );
}

export default function FunctionalScopeZone() {
  const { metrics, filterState } = useFilters();
  const fade = useZoneFade(filterState);
  // Top 8 keeps the no-scroll desktop layout (top 10 are computed; §8 mobile shows top 5).
  const functions = metrics.functions.slice(0, 8);
  const team = [
    { key: "P25", value: metrics.team.p25, accent: false },
    { key: "P50", value: metrics.team.p50, accent: true },
    { key: "P75", value: metrics.team.p75, accent: false },
  ];

  return (
    <section
      style={{
        flex: 1.0,
        minHeight: 0,
        overflow: "hidden",
        padding: "20px 26px",
        borderTop: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
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
        Functional Scope
      </span>

      <div style={{ display: "flex", gap: 0 }}>
        {/* Function bars */}
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}
        >
          {functions.map((fn) => (
            <FunctionBar key={fn.name} label={fn.name} pct={fn.pct} />
          ))}
        </div>

        {/* Team size panel */}
        <div
          style={{
            width: 130,
            flexShrink: 0,
            borderLeft: "1px solid var(--border)",
            paddingLeft: 20,
            marginLeft: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: 11,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
            }}
          >
            Team Size
          </span>
          {team.map((row) => (
            <div
              key={row.key}
              style={{ display: "flex", alignItems: "baseline", gap: 10 }}
            >
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10.5,
                  color: "var(--text-tertiary)",
                  width: 26,
                }}
              >
                {row.key}
              </span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400,
                  fontSize: 22,
                  lineHeight: 1,
                  color: row.accent ? "var(--champagne)" : "var(--text-primary)",
                }}
              >
                {Math.round(row.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
