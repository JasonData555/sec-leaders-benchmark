"use client";

import { useFilters } from "@/app/benchmark/FilterContext";
import { useZoneFade } from "@/app/benchmark/useZoneFade";
import { formatPercent } from "@/lib/metrics";
import type { BoardMetrics, DOMetrics } from "@/lib/metrics";

const CARD_LABEL: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 400,
  fontSize: 13,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "var(--text-tertiary)",
};

const SUBLABEL: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 300,
  fontSize: 12.5,
  color: "var(--text-tertiary)",
};

const cardStyle: React.CSSProperties = {
  flex: "1 0 auto",
  background: "var(--ink-surface)",
  border: "1px solid var(--border)",
  borderRadius: 3,
  padding: "11px 13px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: 8,
};

function BigStat({ value }: { value: number }) {
  return (
    <span
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 400,
        fontSize: 34,
        lineHeight: 1,
        color: "var(--text-primary)",
      }}
    >
      {Math.round(value)}
      <sup style={{ fontSize: 18, opacity: 0.7 }}>%</sup>
    </span>
  );
}

function BoardAccessCard({ board }: { board: BoardMetrics }) {
  const segments = [
    { label: "Quarterly", pct: board.quarterly, color: "var(--champagne)" },
    { label: "Semi-Ann.", pct: board.semiAnnual, color: "var(--donut-champagne-light)" },
    { label: "Annually", pct: board.annual, color: "var(--donut-cobalt-light)" },
    { label: "Per Request", pct: board.perRequest, color: "var(--data-cobalt)" },
    { label: "None", pct: board.none, color: "rgba(247, 249, 252, 0.14)" },
  ];
  return (
    <div style={cardStyle}>
      <span style={CARD_LABEL}>Board Access</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {segments.map((seg) => (
          <div key={seg.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ ...SUBLABEL, width: 74, flexShrink: 0 }}>{seg.label}</span>
            <span
              style={{
                flex: 1,
                height: 4,
                background: "var(--bar-bg)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: `${seg.pct}%`,
                  height: "100%",
                  background: seg.color,
                }}
              />
            </span>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12.5,
                color: "var(--text-tertiary)",
                width: 32,
                textAlign: "right",
                flexShrink: 0,
              }}
            >
              {formatPercent(seg.pct)}
            </span>
          </div>
        ))}
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
            <span style={{ ...SUBLABEL, width: 70, flexShrink: 0 }}>{bar.label}</span>
            <span
              style={{
                flex: 1,
                height: 4,
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
                fontSize: 13,
                color: "var(--text-tertiary)",
                width: 40,
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
  half,
}: {
  label: string;
  value: number;
  sublabel?: string;
  half?: boolean;
}) {
  return (
    <div
      style={
        half
          ? { ...cardStyle, flex: "1 1 0", minWidth: 0, alignItems: "center" }
          : cardStyle
      }
    >
      <span
        style={
          half
            ? { ...CARD_LABEL, fontSize: 11.5, letterSpacing: "0.04em", textAlign: "center" }
            : CARD_LABEL
        }
      >
        {label}
      </span>
      <BigStat value={value} />
      {sublabel ? <span style={SUBLABEL}>{sublabel}</span> : null}
    </div>
  );
}

export default function GovernanceZone() {
  const { metrics, filterState } = useFilters();
  const fade = useZoneFade(filterState);
  return (
    <section
      className="gov-zone"
      style={{
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
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
        Governance &amp; Protection
      </span>
      <div className="gov-cards">
        <BoardAccessCard board={metrics.board} />
        <DandOCard dao={metrics.do} />
        <div className="gov-pair">
          <StatCard half label="Severance" value={metrics.severance} />
          <StatCard half label="Accl. Vesting" value={metrics.vesting} />
        </div>
      </div>
    </section>
  );
}
