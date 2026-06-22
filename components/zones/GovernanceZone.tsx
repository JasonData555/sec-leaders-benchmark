"use client";

import { useFilters } from "@/app/benchmark/FilterContext";
import { useZoneFade } from "@/app/benchmark/useZoneFade";
import { formatPercent } from "@/lib/metrics";
import type { BoardMetrics, DOMetrics } from "@/lib/metrics";

const CARD_LABEL: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 400,
  fontSize: 8.5,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "var(--text-tertiary)",
};

const SUBLABEL: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 300,
  fontSize: 8.5,
  color: "var(--text-tertiary)",
};

const cardStyle: React.CSSProperties = {
  flex: 1,
  background: "var(--ink-surface)",
  border: "1px solid var(--border)",
  borderRadius: 3,
  padding: "12px 14px",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

function BigStat({ value }: { value: number }) {
  return (
    <span
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 400,
        fontSize: 32,
        lineHeight: 1,
        color: "var(--text-primary)",
      }}
    >
      {Math.round(value)}
      <sup style={{ fontSize: 15, opacity: 0.4 }}>%</sup>
    </span>
  );
}

const C = 2 * Math.PI * 19.5; // circle circumference

function BoardAccessCard({ board }: { board: BoardMetrics }) {
  const segments = [
    { label: "Quarterly", pct: board.quarterly, color: "var(--champagne)" },
    { label: "Semi-Ann.", pct: board.semiAnnual, color: "var(--champagne-mid)" },
    { label: "Annually", pct: board.annual, color: "rgba(184, 168, 130, 0.40)" },
    { label: "Per Request", pct: board.perRequest, color: "rgba(184, 168, 130, 0.22)" },
    { label: "None", pct: board.none, color: "rgba(184, 168, 130, 0.11)" },
  ];
  let cumulative = 0;
  return (
    <div style={cardStyle}>
      <span style={CARD_LABEL}>Board Access</span>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <svg width={48} height={48} viewBox="0 0 48 48">
          <g transform="rotate(-90 24 24)">
            <circle
              cx={24}
              cy={24}
              r={19.5}
              fill="none"
              stroke="var(--bar-bg)"
              strokeWidth={9}
            />
            {segments.map((seg) => {
              const len = (seg.pct / 100) * C;
              const offset = -(cumulative / 100) * C;
              cumulative += seg.pct;
              return (
                <circle
                  key={seg.label}
                  cx={24}
                  cy={24}
                  r={19.5}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={9}
                  strokeDasharray={`${len} ${C - len}`}
                  strokeDashoffset={offset}
                />
              );
            })}
          </g>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {segments.map((seg) => (
            <div
              key={seg.label}
              style={{ display: "flex", alignItems: "center", gap: 5 }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: seg.color,
                  flexShrink: 0,
                }}
              />
              <span style={SUBLABEL}>{seg.label}</span>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 8,
                  color: "var(--text-tertiary)",
                  marginLeft: "auto",
                }}
              >
                {formatPercent(seg.pct)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DandOCard({ dao }: { dao: DOMetrics }) {
  const bars = [
    { label: "Full D&O", pct: dao.fullDO },
    { label: "Indemnified", pct: dao.indemnified },
    { label: "Neither", pct: dao.neither },
  ];
  return (
    <div style={cardStyle}>
      <span style={CARD_LABEL}>D&amp;O Protection</span>
      <BigStat value={dao.combined} />
      <span style={SUBLABEL}>Full or indemnified coverage</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 2 }}>
        {bars.map((bar) => (
          <div key={bar.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ ...SUBLABEL, width: 80, flexShrink: 0 }}>{bar.label}</span>
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
                  width: `${bar.pct}%`,
                  height: "100%",
                  background: "var(--champagne)",
                }}
              />
            </span>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 8,
                color: "var(--text-tertiary)",
                width: 26,
                textAlign: "right",
                flexShrink: 0,
              }}
            >
              {formatPercent(bar.pct)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: number;
  sublabel: string;
}) {
  return (
    <div style={cardStyle}>
      <span style={CARD_LABEL}>{label}</span>
      <BigStat value={value} />
      <span style={SUBLABEL}>{sublabel}</span>
    </div>
  );
}

export default function GovernanceZone() {
  const { metrics, filterState } = useFilters();
  const fade = useZoneFade(filterState);
  return (
    <section
      style={{
        flex: 1.2,
        minHeight: 0,
        overflow: "hidden",
        padding: "20px 26px",
        borderTop: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        ...fade,
      }}
    >
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 8.5,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--text-tertiary)",
        }}
      >
        Governance &amp; Protection
      </span>
      <div style={{ display: "flex", gap: 10 }}>
        <BoardAccessCard board={metrics.board} />
        <DandOCard dao={metrics.do} />
        <StatCard
          label="Severance"
          value={metrics.severance}
          sublabel="Pre-negotiated agreement"
        />
        <StatCard
          label="Accelerated Vesting"
          value={metrics.vesting}
          sublabel="Accelerated vesting clause"
        />
      </div>
    </section>
  );
}
