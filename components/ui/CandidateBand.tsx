"use client";

import { useFilters } from "@/app/benchmark/FilterContext";
import { parseComp, percentileRank, formatDollars } from "@/lib/metrics";

const DO_LABEL: Record<string, string> = {
  "D&O Policy": "D&O Included",
  Indemnified: "Indemnified",
  Neither: "No D&O",
};

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

export default function CandidateBand() {
  const { candidate, filteredRecords, setCandidate } = useFilters();
  if (!candidate) return null;

  const values = filteredRecords
    .map((r) => parseComp(r["Total Comp-Converted"]))
    .filter((v): v is number => v !== null);
  const rank = Math.round(percentileRank(values, candidate.totalComp));

  return (
    <div
      style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "10px 26px",
        background: "var(--accent-glow)",
        borderTop: "1px solid rgba(140, 109, 63, 0.30)",
      }}
    >
      {/* Left: label + summary */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10.5,
            letterSpacing: "0.12em",
            color: "var(--champagne)",
            whiteSpace: "nowrap",
          }}
        >
          CANDIDATE PROFILE
        </span>
        <span
          style={{ width: 1, height: 12, background: "var(--border)", flexShrink: 0 }}
          aria-hidden
        />
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: 15,
            color: "var(--text-primary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {formatDollars(candidate.totalComp)} Total Comp ·{" "}
          {DO_LABEL[candidate.doStatus]} · {candidate.board} Board Access
        </span>
      </div>

      {/* Right: percentile + dismiss */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            color: "var(--champagne)",
            whiteSpace: "nowrap",
          }}
        >
          ↑ {ordinal(rank)} percentile
        </span>
        <button
          type="button"
          onClick={() => setCandidate(null)}
          aria-label="Dismiss comparison"
          style={{
            background: "none",
            border: "none",
            color: "var(--text-tertiary)",
            fontSize: 14,
            lineHeight: 1,
            cursor: "pointer",
            padding: 2,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
