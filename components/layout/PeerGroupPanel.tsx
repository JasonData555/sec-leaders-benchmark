"use client";

import { useState } from "react";
import { useFilters } from "@/app/benchmark/FilterContext";
import NCounter from "@/components/ui/NCounter";

const groupLabel: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 11,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "var(--text-tertiary)",
};

/** Single-select segments for the Industry Tier toggle. `null` = all tiers.
 *  `tip` (when present) is the hover-tooltip definition of that tier. */
const TIER_SEGMENTS: { label: string; value: string | null; tip?: string }[] = [
  { label: "All Tiers", value: null },
  {
    label: "Baseline Risk",
    value: "Baseline",
    tip: "Security leaders at organizations in lower-exposure sectors — professional services, manufacturing, retail, education, logistics and the like. Compensation here is driven mainly by company size, industry, and security-program maturity.",
  },
  {
    label: "High Consequence",
    value: "High Consequence",
    tip: "Security leaders at organizations in regulated, high-exposure sectors — financial services, healthcare, cloud infrastructure, AI, aerospace & defense and the like. A breach carries outsized regulatory, financial, or safety fallout, and the market prices that organizational risk into a structural compensation premium.",
  },
];

function TierToggle() {
  const { filterState, setTier } = useFilters();
  const selected = filterState.industryTier;
  const [tip, setTip] = useState<{
    label: string;
    text: string;
    x: number;
    y: number;
  } | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={groupLabel}>Industry Tier</span>
      <div
        className="tier-toggle"
        style={{
          background: "var(--chip-bg)",
          border: "1px solid var(--border)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {TIER_SEGMENTS.map((seg, i) => {
          const active =
            seg.value === null
              ? selected.length === 0
              : selected[0] === seg.value;
          return (
            <button
              key={seg.label}
              type="button"
              onClick={() => setTier(seg.value)}
              onMouseEnter={(e) => {
                if (!seg.tip) return;
                const r = e.currentTarget.getBoundingClientRect();
                setTip({ label: seg.label, text: seg.tip, x: r.left, y: r.bottom + 6 });
              }}
              onMouseLeave={() => setTip(null)}
              className="tier-segment"
              data-first={i === 0 || undefined}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: 13,
                lineHeight: 1.3,
                padding: "9px 14px",
                whiteSpace: "nowrap",
                cursor: "pointer",
                border: "none",
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

      {tip && (
        <div
          style={{
            position: "fixed",
            top: tip.y,
            left: tip.x,
            zIndex: 60,
            maxWidth: 260,
            padding: "10px 12px",
            background: "var(--ink-surface)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--champagne)",
            }}
          >
            {tip.label}
          </span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: 12,
              lineHeight: 1.45,
              color: "var(--text-secondary)",
            }}
          >
            {tip.text}
          </span>
        </div>
      )}
    </div>
  );
}

export default function PeerGroupPanel() {
  const { nCount, lowSample } = useFilters();

  return (
    <div className="peer-panel-inner">
      {/* Header row */}
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
          Peer Group
        </span>
        <NCounter n={nCount} />
      </div>

      {lowSample && (
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: 11,
            lineHeight: 1.4,
            color: "var(--text-tertiary)",
            marginTop: -14,
          }}
        >
          Small sample — broaden your filters.
        </span>
      )}

      <TierToggle />
    </div>
  );
}
