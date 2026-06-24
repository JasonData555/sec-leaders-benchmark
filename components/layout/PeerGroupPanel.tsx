"use client";

import { useFilters } from "@/app/benchmark/FilterContext";
import { SIZE_ORDER, type FilterState } from "@/lib/filters";
import Chip from "@/components/ui/Chip";
import NCounter from "@/components/ui/NCounter";

interface Option {
  label: string;
  value: string;
}

const SIZE_LABELS: Record<string, string> = {
  "< 250 employees": "< 250",
  "250 - 499 employees": "250–499",
  "500 - 999 employees": "500–999",
  "1000 - 4999 employees": "1K–5K",
  "5000 - 9,999 employees": "5K–10K",
  "10,000 - 25,000 employees": "10K–25K",
  "25,000+ employees": "25K+",
};
const SIZE_OPTIONS: Option[] = SIZE_ORDER.map((value) => ({
  label: SIZE_LABELS[value],
  value,
}));

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
    <div
      style={{
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 22,
      }}
    >
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
      <ChipGroup
        label="Company Size"
        options={SIZE_OPTIONS}
        selected={filterState.sizes}
        filterKey="sizes"
      />
    </div>
  );
}
