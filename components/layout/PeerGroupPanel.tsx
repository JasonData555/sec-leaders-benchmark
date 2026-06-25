"use client";

import { useFilters } from "@/app/benchmark/FilterContext";
import NCounter from "@/components/ui/NCounter";

const groupLabel: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 11,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "var(--text-tertiary)",
};

/** Single-select segments for the Industry Tier toggle. `null` = all tiers. */
const TIER_SEGMENTS: { label: string; value: string | null }[] = [
  { label: "All Tiers", value: null },
  { label: "Baseline Risk", value: "Baseline" },
  { label: "High Consequence", value: "High Consequence" },
];

function TierToggle() {
  const { filterState, setTier } = useFilters();
  const selected = filterState.industryTier;

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
