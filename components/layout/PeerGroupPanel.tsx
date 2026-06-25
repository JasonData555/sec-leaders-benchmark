"use client";

import { useFilters } from "@/app/benchmark/FilterContext";
import { type FilterState } from "@/lib/filters";
import Chip from "@/components/ui/Chip";
import NCounter from "@/components/ui/NCounter";

interface Option {
  label: string;
  value: string;
}

const TIER_OPTIONS: Option[] = [
  { label: "Baseline Risk",    value: "Baseline" },
  { label: "High Consequence", value: "High Consequence" },
];

const groupLabel: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 11,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "var(--text-tertiary)",
};

function ChipGroup({
  label,
  options,
  selected,
  filterKey,
  size = "md",
}: {
  label: string;
  options: Option[];
  selected: string[];
  filterKey: keyof FilterState;
  size?: "md" | "lg";
}) {
  const { setFilter } = useFilters();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={groupLabel}>{label}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {options.map((opt) => (
          <Chip
            key={opt.value}
            label={opt.label}
            state={selected.includes(opt.value) ? "active" : "resting"}
            onClick={() => setFilter(filterKey, opt.value)}
            size={size}
          />
        ))}
      </div>
    </div>
  );
}

export default function PeerGroupPanel() {
  const { filterState, nCount, lowSample } = useFilters();

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

      <ChipGroup
        label="Industry Tier"
        options={TIER_OPTIONS}
        selected={filterState.industryTier}
        filterKey="industryTier"
        size="lg"
      />
    </div>
  );
}
