"use client";

import { useFilters } from "@/app/benchmark/FilterContext";

const ROLES = [
  "CISO",
  "Deputy CISO",
  "VP Security",
  "Director Product Security",
  "Director Security Engineering",
  "Director GRC",
  "VP Business Technology",
];

const groupLabel: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 11,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "var(--text-tertiary)",
};

export default function RoleFilter() {
  const { filterState, setRole } = useFilters();
  const current = filterState.roles[0] ?? "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={groupLabel}>Role</span>
      <div style={{ position: "relative" }}>
        <select
          value={current}
          onChange={(e) => setRole(e.target.value || null)}
          style={{
            width: "100%",
            background: "var(--ink-surface)",
            border: "1px solid var(--border)",
            borderRadius: 2,
            padding: "6px 28px 6px 8px",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: 12,
            color: current ? "var(--text-primary)" : "var(--text-tertiary)",
            cursor: "pointer",
            appearance: "none",
            WebkitAppearance: "none",
          }}
        >
          <option value="">All Roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {/* Custom caret — overrides native arrow */}
        <svg
          viewBox="0 0 10 6"
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            width: 10,
            height: 6,
            pointerEvents: "none",
            fill: "none",
            stroke: "var(--text-tertiary)",
            strokeWidth: 1.5,
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        >
          <polyline points="1,1 5,5 9,1" />
        </svg>
      </div>
    </div>
  );
}
