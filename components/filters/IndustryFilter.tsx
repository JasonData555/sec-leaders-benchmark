"use client";

import { useMemo, useState } from "react";
import { allRecords } from "@/lib/data";
import { useFilters } from "@/app/benchmark/FilterContext";
import Chip from "@/components/ui/Chip";

/** All distinct industries, sorted (computed once at module load). */
const INDUSTRIES = Array.from(
  new Set(allRecords.map((r) => r["Industry"]).filter(Boolean))
).sort();

const groupLabel: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 9,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "var(--text-tertiary)",
};

export default function IndustryFilter() {
  const { filterState, setFilter } = useFilters();
  const [query, setQuery] = useState("");

  const active = filterState.industries;
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = q
      ? INDUSTRIES.filter((i) => i.toLowerCase().includes(q))
      : [];
    // Active selections always visible (so they stay removable), then matches.
    return Array.from(new Set([...active, ...matches]));
  }, [query, active]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={groupLabel}>Industry</span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search industries"
        style={{
          width: "100%",
          background: "var(--ink-surface)",
          border: "1px solid var(--border)",
          borderRadius: 2,
          padding: "6px 8px",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: 10,
          color: "var(--text-primary)",
        }}
      />
      {shown.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {shown.map((industry) => (
            <Chip
              key={industry}
              label={industry}
              state={active.includes(industry) ? "active" : "resting"}
              onClick={() => setFilter("industries", industry)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
